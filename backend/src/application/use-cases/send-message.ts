import { createMessage, createMessageId, createRoomId, createUserId } from "../../domain"
import { NotFoundError, UnauthorizedError } from "../errors"
import { type MessageResponse, type SendMessageRequest } from "../dto/messages"
import { type Clock } from "../ports/clock"
import { type MessageRepository, type RoomRepository } from "../ports/repositories"

interface SendMessageDeps {
  rooms: RoomRepository;
  messages: MessageRepository;
  clock: Clock;
}

export async function sendMessage(
  deps: SendMessageDeps,
  request: SendMessageRequest
): Promise<MessageResponse> {
  const roomId = createRoomId(request.roomId);
  const authorId = createUserId(request.authorId);
  const messageId = createMessageId(request.messageId);

  const room = await deps.rooms.findById(roomId);
  if (!room) {
    throw new NotFoundError("room not found");
  }

  const isMember = await deps.rooms.isMember(room.id, authorId);
  if (!isMember) {
    throw new UnauthorizedError("user is not a room member");
  }

  const existing = await deps.messages.findById(messageId);
  if (existing) {
    return {
      id: existing.id,
      roomId: existing.roomId,
      authorId: existing.authorId,
      content: existing.content,
      createdAt: existing.createdAt
    };
  }

  const message = createMessage({
    id: messageId,
    roomId: room.id,
    authorId,
    content: request.content,
    createdAt: deps.clock.now()
  });

  await deps.messages.save(message);

  return {
    id: message.id,
    roomId: message.roomId,
    authorId: message.authorId,
    content: message.content,
    createdAt: message.createdAt
  };
}
