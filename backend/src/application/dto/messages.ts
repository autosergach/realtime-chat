import { type MessageId, type RoomId, type UserId } from "../../domain";

export interface SendMessageRequest {
  roomId: RoomId;
  authorId: UserId;
  messageId: MessageId;
  content: string;
}

export interface MessageResponse {
  id: MessageId;
  roomId: RoomId;
  authorId: UserId;
  content: string;
  createdAt: Date;
}
