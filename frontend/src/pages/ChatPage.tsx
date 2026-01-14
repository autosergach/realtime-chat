import { useMemo, useState } from "react";
import { PresenceBadge } from "../components/PresenceBadge";

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
  const [draft, setDraft] = useState("");

  const participants = useMemo(
    () => [
      { id: "u1", name: "Alex Morgan", status: "online" as const },
      { id: "u2", name: "Sofia Rios", status: "online" as const },
      { id: "u3", name: "Jamie Chen", status: "offline" as const }
    ],
    []
  );

  function handleSend() {
    if (!draft.trim()) {
      return;
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

  return (
    <div className="page chat">
      <header className="chat__header">
        <div>
          <span className="eyebrow">Room</span>
          <h1>Product Strategy</h1>
          <p className="muted">At-least-once delivery · 12 members</p>
        </div>
        <div className="presence">
          {participants.map((participant) => (
            <PresenceBadge key={participant.id} participant={participant} />
          ))}
        </div>
      </header>

      <section className="chat__body">
        <div className="message-input">
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
