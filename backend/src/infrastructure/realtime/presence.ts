import { type Clock } from "../../application/ports/clock";

export interface PresenceState {
  readonly userId: string;
  readonly status: "online" | "offline";
  readonly lastSeenAt: string | null;
}

export class PresenceTracker {
  private readonly seenAt = new Map<string, number>();

  constructor(private readonly clock: Clock, private readonly ttlMs: number) {}

  markOnline(userId: string): PresenceState {
    const now = this.clock.now().getTime();
    this.seenAt.set(userId, now);
    return {
      userId,
      status: "online",
      lastSeenAt: new Date(now).toISOString()
    };
  }

  markOffline(userId: string): PresenceState {
    const now = this.clock.now().getTime();
    this.seenAt.set(userId, now);
    return {
      userId,
      status: "offline",
      lastSeenAt: new Date(now).toISOString()
    };
  }

  getExpiredUserIds(): string[] {
    const now = this.clock.now().getTime();
    const expired: string[] = [];
    for (const [userId, lastSeen] of this.seenAt.entries()) {
      if (now - lastSeen >= this.ttlMs) {
        expired.push(userId);
      }
    }
    return expired;
  }
}
