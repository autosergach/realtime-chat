interface RoomListItemProps {
  room: {
    id: string;
    name: string;
    members: number;
    unread: number;
  };
  onOpen: (roomId: string) => void;
}

export function RoomListItem({ room, onOpen }: RoomListItemProps) {
  return (
    <article className="room-card">
      <div>
        <h3>{room.name}</h3>
        <p className="muted">{room.members} members</p>
      </div>
      <div className="room-card__meta">
        {room.unread > 0 ? <span className="badge">{room.unread}</span> : null}
        <button
          className="ghost"
          onClick={() => onOpen(room.id)}
          data-testid={`room-open-${room.name}`}
        >
          Open
        </button>
      </div>
    </article>
  );
}
