interface PresenceBadgeProps {
  participant: {
    id: string;
    name: string;
    status: "online" | "offline";
  };
}

export function PresenceBadge({ participant }: PresenceBadgeProps) {
  return (
    <div className="presence-pill">
      <span className={`dot ${participant.status}`} />
      <span>{participant.name}</span>
    </div>
  );
}
