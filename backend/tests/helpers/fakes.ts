import {
  type Email,
  type Message,
  type MessageId,
  type PasswordHash,
  type Room,
  type RoomId,
  type User,
  type UserId,
  createEmail,
  createMessageId,
  createPasswordHash,
  createRoomId,
  createUserId
} from "../../src/domain";
import { type Clock } from "../../src/application/ports/clock";
import { type IdGenerator } from "../../src/application/ports/ids";
import {
  type MessageRepository,
  type RoomRepository,
  type UserRepository
} from "../../src/application/ports/repositories";
import { type PasswordHasher, type TokenIssuer } from "../../src/application/ports/security";

export class FixedClock implements Clock {
  constructor(private readonly fixed: Date) {}

  now(): Date {
    return new Date(this.fixed);
  }
}

export class StaticIdGenerator implements IdGenerator {
  constructor(
    private readonly userId: UserId,
    private readonly roomId: RoomId,
    private readonly messageId: MessageId
  ) {}

  nextUserId(): UserId {
    return this.userId;
  }

  nextRoomId(): RoomId {
    return this.roomId;
  }

  nextMessageId(): MessageId {
    return this.messageId;
  }
}

export class InMemoryUserRepository implements UserRepository {
  private readonly usersById = new Map<UserId, User>();
  private readonly usersByEmail = new Map<Email, User>();

  async findById(id: UserId): Promise<User | null> {
    return this.usersById.get(id) ?? null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.usersByEmail.get(email) ?? null;
  }

  async save(user: User): Promise<void> {
    this.usersById.set(user.id, user);
    this.usersByEmail.set(user.email, user);
  }

  async updateLastSeen(id: UserId, lastSeenAt: Date): Promise<void> {
    const user = this.usersById.get(id);
    if (!user) {
      return;
    }
    const updated = { ...user, lastSeenAt };
    this.usersById.set(id, updated);
    this.usersByEmail.set(user.email, updated);
  }
}

export class InMemoryRoomRepository implements RoomRepository {
  private readonly rooms = new Map<RoomId, Room>();
  private readonly members = new Map<RoomId, Set<UserId>>();

  async findById(id: RoomId): Promise<Room | null> {
    return this.rooms.get(id) ?? null;
  }

  async listForUser(userId: UserId): Promise<Room[]> {
    const results: Room[] = [];
    for (const [roomId, room] of this.rooms.entries()) {
      const memberSet = this.members.get(roomId);
      if (memberSet?.has(userId)) {
        results.push(room);
      }
    }
    return results;
  }

  async save(room: Room): Promise<void> {
    this.rooms.set(room.id, room);
  }

  async addMember(roomId: RoomId, userId: UserId, joinedAt: Date): Promise<void> {
    void joinedAt;
    const memberSet = this.members.get(roomId) ?? new Set<UserId>();
    memberSet.add(userId);
    this.members.set(roomId, memberSet);
  }

  async isMember(roomId: RoomId, userId: UserId): Promise<boolean> {
    return this.members.get(roomId)?.has(userId) ?? false;
  }
}

export class InMemoryMessageRepository implements MessageRepository {
  private readonly messages = new Map<MessageId, Message>();
  private readonly messagesByRoom = new Map<RoomId, MessageId[]>();

  async findById(id: MessageId): Promise<Message | null> {
    return this.messages.get(id) ?? null;
  }

  async listByRoom(roomId: RoomId, limit: number): Promise<Message[]> {
    const ids = this.messagesByRoom.get(roomId) ?? [];
    return ids
      .slice(-limit)
      .map((id) => this.messages.get(id))
      .filter((message): message is Message => Boolean(message));
  }

  async save(message: Message): Promise<void> {
    this.messages.set(message.id, message);
    const roomMessages = this.messagesByRoom.get(message.roomId) ?? [];
    roomMessages.push(message.id);
    this.messagesByRoom.set(message.roomId, roomMessages);
  }
}

export class AcceptAllHasher implements PasswordHasher {
  async hash(password: string): Promise<PasswordHash> {
    return createPasswordHash(`hashed:${password}`);
  }

  async verify(password: string, hash: PasswordHash): Promise<boolean> {
    return hash === createPasswordHash(`hashed:${password}`);
  }
}

export class StaticTokenIssuer implements TokenIssuer {
  constructor(private readonly token: string) {}

  async issueAccessToken(userId: UserId): Promise<string> {
    void userId;
    return this.token;
  }
}

export const ids = {
  user: createUserId("user-1"),
  user2: createUserId("user-2"),
  room: createRoomId("room-1"),
  message: createMessageId("message-1")
};

export const emails = {
  primary: createEmail("user@example.com")
};
