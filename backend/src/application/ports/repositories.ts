import { type Message, type MessageId, type Room, type RoomId, type User, type UserId } from "../../domain";

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  updateLastSeen(id: UserId, lastSeenAt: Date): Promise<void>;
}

export interface RoomRepository {
  findById(id: RoomId): Promise<Room | null>;
  listForUser(userId: UserId): Promise<Room[]>;
  save(room: Room): Promise<void>;
  addMember(roomId: RoomId, userId: UserId, joinedAt: Date): Promise<void>;
  isMember(roomId: RoomId, userId: UserId): Promise<boolean>;
}

export interface MessageRepository {
  findById(id: MessageId): Promise<Message | null>;
  listByRoom(roomId: RoomId, limit: number): Promise<Message[]>;
  save(message: Message): Promise<void>;
}
