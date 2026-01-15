import { randomUUID } from "node:crypto";
import { type IdGenerator } from "../application/ports/ids";
import { type MessageId, type RoomId, type UserId } from "../domain";

export class RandomIdGenerator implements IdGenerator {
  nextUserId(): UserId {
    return randomUUID() as UserId;
  }

  nextRoomId(): RoomId {
    return randomUUID() as RoomId;
  }

  nextMessageId(): MessageId {
    return randomUUID() as MessageId;
  }
}
