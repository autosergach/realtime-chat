import { type MessageId, type RoomId, type UserId } from "../../domain";

export interface IdGenerator {
  nextUserId(): UserId;
  nextRoomId(): RoomId;
  nextMessageId(): MessageId;
}
