import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { PresenceBadge } from "../components/PresenceBadge";
import { useSocket } from "../hooks/useSocket";
import { type ServerToClientEvent } from "../realtime/contracts";
import { useAuth } from "../state/auth";
import { listMessages } from "../api/rooms";

const initialMessages = [
  {
    id: "m1",
    author: "Alex Morgan",
    content: "We need to align on the at-least-once delivery trade-off.",
    time: "09:32"
  },
  {
    id: "m2",
    author: "Sofia Rios",
    content: "Presence heartbeats look good. Let's add the timeout diagram.",
    time: "09:34"
  }
];

export function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const params = useParams();
  const [roomId, setRoomId] = useState(params.roomId ?? "room-1");
  const [presence, setPresence] = useState<Record<string, "online" | "offline">>({});
  const [realtimeError, setRealtimeError] = useState<string | null>(null);
  const { session } = useAuth();
  const userId = session?.userId ?? "user-1";
  const { socket, connected } = useSocket(
    import.meta.env.VITE_REALTIME_URL ?? "http://localhost:3000",
    userId
  );
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

  const participants = useMemo(
    () => [
      { id: "u1", name: "Alex Morgan", status: presence["u1"] ?? "online" },
      { id: "u2", name: "Sofia Rios", status: presence["u2"] ?? "online" },
      { id: "u3", name: "Jamie Chen", status: presence["u3"] ?? "offline" }
    ],
    [presence]
  );

  function handleSend() {
    if (!draft.trim()) {
      return;
    }
    if (socket) {
      socket.emit("client_event", {
        type: "send_message",
        payload: {
          roomId,
          messageId:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : String(Date.now()),
          content: draft.trim()
        }
      });
    }
    setMessages([
      {
        id: `m-${messages.length + 1}`,
        author: "You",
        content: draft.trim(),
        time: "now"
      },
      ...messages
    ]);
    setDraft("");
  }

  useEffect(() => {
    if (!socket) {
      return;
    }
    const handler = (event: ServerToClientEvent) => {
      if (event.type === "message") {
        setMessages((current) => [
          {
            id: event.payload.message.id,
            author: event.payload.message.authorId,
            content: event.payload.message.content,
            time: "now"
          },
          ...current
        ]);
      }
      if (event.type === "presence_update") {
        setPresence((current) => ({
          ...current,
          [event.payload.userId]: event.payload.status
        }));
      }
      if (event.type === "error") {
        setRealtimeError(event.payload.message);
      }
    };
    socket.on("server_event", handler);
    return () => {
      socket.off("server_event", handler);
    };
  }, [socket]);

  function handleJoinRoom() {
    if (!socket || !roomId.trim()) {
      return;
    }
    socket.emit("client_event", {
      type: "join_room",
      payload: { roomId }
    });
  }

  useEffect(() => {
    if (params.roomId) {
      setRoomId(params.roomId);
    }
  }, [params.roomId]);

  useEffect(() => {
    let mounted = true;
    async function loadHistory() {
      if (!session || !roomId) {
        return;
      }
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const history = await listMessages(apiUrl, session.userId, roomId);
        if (!mounted) {
          return;
        }
        setMessages(
          history.map((message) => ({
            id: message.id,
            author: message.authorId,
            content: message.content,
            time: new Date(message.createdAt).toLocaleTimeString()
          }))
        );
      } catch (err) {
        if (mounted) {
          setHistoryError(err instanceof Error ? err.message : "Unable to load history.");
        }
      } finally {
        if (mounted) {
          setHistoryLoading(false);
        }
      }
    }
    void loadHistory();
    return () => {
      mounted = false;
    };
  }, [apiUrl, roomId, session]);

  return (
    <div className="page chat">
      <header className="chat__header">
        <div>
          <span className="eyebrow">Room</span>
          <h1>Realtime delivery room</h1>
          <p className="muted">
            {connected ? "Connected" : "Disconnected"} · Room {roomId}
          </p>
        </div>
        <div className="presence">
          {participants.map((participant) => (
            <PresenceBadge key={participant.id} participant={participant} />
          ))}
        </div>
      </header>

      <section className="chat__body">
        <div className="message-input">
          <label className="field">
            <span>Room ID</span>
            <input value={roomId} onChange={(event) => setRoomId(event.target.value)} />
          </label>
          <button className="ghost" onClick={handleJoinRoom}>
            Join room
          </button>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a message..."
          />
          <button className="primary" onClick={handleSend}>
            Send message
          </button>
        </div>

        <div className="message-list">
          {historyLoading ? <p className="muted">Loading history...</p> : null}
          {historyError ? <p className="error">{historyError}</p> : null}
          {realtimeError ? <p className="error">Realtime: {realtimeError}</p> : null}
          {messages.map((message) => (
            <article key={message.id} className="message-card">
              <div className="message-card__meta">
                <strong>{message.author}</strong>
                <span className="muted">{message.time}</span>
              </div>
              <p>{message.content}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
