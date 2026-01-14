import { type RoomId, type UserId } from "../../domain";

export interface CreateRoomRequest {
  name: string;
  isPrivate?: boolean;
  createdBy: UserId;
}

export interface RoomSummary {
  id: RoomId;
  name: string;
  isPrivate: boolean;
}

export interface JoinRoomRequest {
  roomId: RoomId;
  userId: UserId;
}
