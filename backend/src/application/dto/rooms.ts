export interface CreateRoomRequest {
  name: string;
  isPrivate?: boolean;
  createdBy: string;
}

export interface RoomSummary {
  id: string;
  name: string;
  isPrivate: boolean;
}

export interface JoinRoomRequest {
  roomId: string;
  userId: string;
}
