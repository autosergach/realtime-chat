import { createRoomId, createUserId } from "../../domain";
import { NotFoundError, UnauthorizedError } from "../errors";
import { type ListMessagesRequest, type MessageResponse } from "../dto/messages";
import { type MessageRepository, type RoomRepository } from "../ports/repositories";

interface ListMessagesDeps {
  rooms: RoomRepository;
  messages: MessageRepository;
}

export async function listMessages(
  deps: ListMessagesDeps,
  request: ListMessagesRequest
): Promise<MessageResponse[]> {
  const roomId = createRoomId(request.roomId);
  const userId = createUserId(request.userId);

  const room = await deps.rooms.findById(roomId);
  if (!room) {
    throw new NotFoundError("room not found");
  }

  const isMember = await deps.rooms.isMember(room.id, userId);
  if (!isMember) {
    throw new UnauthorizedError("user is not a room member");
  }

  const messages = await deps.messages.listByRoom(room.id, request.limit);
  return messages.map((message) => ({
    id: message.id,
    roomId: message.roomId,
    authorId: message.authorId,
    content: message.content,
    createdAt: message.createdAt
  }));
}
