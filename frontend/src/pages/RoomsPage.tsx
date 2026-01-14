import { useState } from "react";
import { RoomListItem } from "../components/RoomListItem";

const initialRooms = [
  { id: "room-1", name: "Product Strategy", members: 12, unread: 2 },
  { id: "room-2", name: "Incident Response", members: 8, unread: 0 },
  { id: "room-3", name: "Frontend Guild", members: 21, unread: 5 }
];

export function RoomsPage() {
  const [rooms, setRooms] = useState(initialRooms);
  const [roomName, setRoomName] = useState("");

  function handleCreateRoom() {
    if (!roomName.trim()) {
      return;
    }
    const next = {
      id: `room-${rooms.length + 1}`,
      name: roomName.trim(),
      members: 1,
      unread: 0
    };
    setRooms([next, ...rooms]);
    setRoomName("");
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
          <button className="primary" onClick={handleCreateRoom}>
            Create room
          </button>
        </div>
      </header>

      <section className="room-grid">
        {rooms.map((room) => (
          <RoomListItem key={room.id} room={room} />
        ))}
      </section>
    </div>
  );
}
