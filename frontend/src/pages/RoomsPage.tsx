import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoomListItem } from "../components/RoomListItem";
import { createRoom } from "../api/rooms";
import { useAuth } from "../state/auth";

const initialRooms = [
  { id: "room-1", name: "Product Strategy", members: 12, unread: 2 },
  { id: "room-2", name: "Incident Response", members: 8, unread: 0 },
  { id: "room-3", name: "Frontend Guild", members: 21, unread: 5 }
];

export function RoomsPage() {
  const [rooms, setRooms] = useState(initialRooms);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { session } = useAuth();

  function getApiUrl() {
    return import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  }

  async function handleCreateRoom() {
    if (!roomName.trim()) {
      return;
    }
    if (!session) {
      setError("Please sign in to create a room.");
      return;
    }
    setLoading(true);
    setError(null);
    const next = {
      id: `room-${rooms.length + 1}`,
      name: roomName.trim(),
      members: 1,
      unread: 0
    };
    try {
      const created = await createRoom(getApiUrl(), session.userId, roomName.trim());
      setRooms([{ ...next, id: created.id, name: created.name }, ...rooms]);
      setRoomName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create room.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page rooms">
      <header className="page__header">
        <div>
          <span className="eyebrow">Rooms</span>
          <h1>Your live channels</h1>
          <p className="muted">Stay close to delivery, incidents, and updates.</p>
        </div>
        <div className="actions">
          <input
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            placeholder="New room name"
          />
          <button className="primary" onClick={handleCreateRoom} disabled={loading}>
            {loading ? "Creating..." : "Create room"}
          </button>
        </div>
      </header>
      {error ? <p className="error">{error}</p> : null}

      <section className="room-grid">
        {rooms.map((room) => (
          <RoomListItem key={room.id} room={room} onOpen={(id) => navigate(`/chat/${id}`)} />
        ))}
      </section>
    </div>
  );
}
