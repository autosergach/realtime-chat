import { Prisma } from "@prisma/client";
import { prisma } from "./client";
import {
  type Message,
  type MessageId,
  type PasswordHash,
  type Room,
  type RoomId,
  type User,
  type UserId,
  type Email
} from "../../../domain";
import { ConflictError } from "../../../application/errors";
import { type MessageRepository, type RoomRepository, type UserRepository } from "../../../application/ports/repositories";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

export class PrismaUserRepository implements UserRepository {
  async findById(id: UserId): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? {
      id: user.id as UserId,
      email: user.email as Email,
      passwordHash: user.passwordHash as PasswordHash,
      createdAt: user.createdAt,
      lastSeenAt: user.lastSeenAt
    } : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? {
      id: user.id as UserId,
      email: user.email as Email,
      passwordHash: user.passwordHash as PasswordHash,
      createdAt: user.createdAt,
      lastSeenAt: user.lastSeenAt
    } : null;
  }

  async save(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        lastSeenAt: user.lastSeenAt
      }
    });
  }

  async updateLastSeen(id: UserId, lastSeenAt: Date): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastSeenAt }
    });
  }
}

export class PrismaRoomRepository implements RoomRepository {
  async findById(id: RoomId): Promise<Room | null> {
    const room = await prisma.room.findUnique({ where: { id } });
    return room ? {
      id: room.id as RoomId,
      name: room.name,
      isPrivate: room.isPrivate,
      createdAt: room.createdAt,
      createdBy: room.createdById as UserId
    } : null;
  }

  async listForUser(userId: UserId): Promise<Room[]> {
    const rooms = await prisma.room.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      }
    });
    return rooms.map((room: typeof rooms[number]) => ({
      id: room.id as RoomId,
      name: room.name,
      isPrivate: room.isPrivate,
      createdAt: room.createdAt,
      createdBy: room.createdById as UserId
    }));
  }

  async save(room: Room): Promise<void> {
    await prisma.room.create({
      data: {
        id: room.id,
        name: room.name,
        isPrivate: room.isPrivate,
        createdAt: room.createdAt,
        createdById: room.createdBy
      }
    });
  }

  async addMember(roomId: RoomId, userId: UserId, joinedAt: Date): Promise<void> {
    try {
      await prisma.roomMember.create({
        data: {
          roomId,
          userId,
          joinedAt
        }
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        return;
      }
      throw error;
    }
  }

  async isMember(roomId: RoomId, userId: UserId): Promise<boolean> {
    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId
        }
      }
    });
    return Boolean(membership);
  }
}

export class PrismaMessageRepository implements MessageRepository {
  async findById(id: MessageId): Promise<Message | null> {
    const message = await prisma.message.findUnique({ where: { id } });
    return message ? {
      id: message.id as MessageId,
      roomId: message.roomId as RoomId,
      authorId: message.authorId as UserId,
      content: message.content,
      createdAt: message.createdAt
    } : null;
  }

  async listByRoom(roomId: RoomId, limit: number): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "desc" },
      take: limit
    });
    return messages.map((message: typeof messages[number]) => ({
      id: message.id as MessageId,
      roomId: message.roomId as RoomId,
      authorId: message.authorId as UserId,
      content: message.content,
      createdAt: message.createdAt
    }));
  }

  async save(message: Message): Promise<void> {
    try {
      await prisma.message.create({
        data: {
          id: message.id,
          roomId: message.roomId,
          authorId: message.authorId,
          content: message.content,
          createdAt: message.createdAt
        }
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictError("message already exists");
      }
      throw error;
    }
  }
}
