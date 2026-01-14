import { ValidationError } from "./errors";
import { type MessageId, type RoomId, type UserId } from "./value-objects";

export interface Message {
  readonly id: MessageId;
  readonly roomId: RoomId;
  readonly authorId: UserId;
  readonly content: string;
  readonly createdAt: Date;
}

interface CreateMessageParams {
  id: MessageId;
  roomId: RoomId;
  authorId: UserId;
  content: string;
  createdAt: Date;
}

const MESSAGE_MIN = 1;
const MESSAGE_MAX = 1000;

export function createMessage(params: CreateMessageParams): Message {
  const trimmedContent = params.content.trim();
  if (trimmedContent.length < MESSAGE_MIN || trimmedContent.length > MESSAGE_MAX) {
    throw new ValidationError(
      `message content must be between ${MESSAGE_MIN} and ${MESSAGE_MAX} characters`
    );
  }

  return {
    id: params.id,
    roomId: params.roomId,
    authorId: params.authorId,
    content: trimmedContent,
    createdAt: params.createdAt
  };
}
