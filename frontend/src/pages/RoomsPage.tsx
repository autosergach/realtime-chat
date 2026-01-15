import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoomListItem } from "../components/RoomListItem";
import { createRoom, listRooms } from "../api/rooms";
import { useAuth } from "../state/auth";

export function RoomsPage() {
  const [rooms, setRooms] = useState<
    { id: string; name: string; members: number; unread: number }[]
  >([]);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { session } = useAuth();

  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

  useEffect(() => {
    let mounted = true;
    async function loadRooms() {
      if (!session) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await listRooms(apiUrl, session.userId);
        if (mounted) {
          setRooms(
            data.map((room) => ({
              id: room.id,
              name: room.name,
              members: 0,
              unread: 0
            }))
          );
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unable to load rooms.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    void loadRooms();
    return () => {
      mounted = false;
    };
  }, [apiUrl, session]);

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
    try {
      const created = await createRoom(apiUrl, session.userId, roomName.trim());
      setRooms([
        {
          id: created.id,
          name: created.name,
          members: 1,
          unread: 0
        },
        ...rooms
      ]);
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
          <h1 data-testid="rooms-title">Your live channels</h1>
          <p className="muted">Stay close to delivery, incidents, and updates.</p>
        </div>
        <div className="actions">
          <input
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            placeholder="New room name"
            data-testid="rooms-new-name"
          />
          <button
            className="primary"
            onClick={handleCreateRoom}
            disabled={loading}
            data-testid="rooms-create"
          >
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
