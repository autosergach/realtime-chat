export interface SendMessageRequest {
  roomId: string;
  authorId: string;
  messageId: string;
  content: string;
}

export interface MessageResponse {
  id: string;
  roomId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface ListMessagesRequest {
  roomId: string;
  userId: string;
  limit: number;
}
