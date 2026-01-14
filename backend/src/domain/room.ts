import { ValidationError } from "./errors";
import { type RoomId, type UserId } from "./value-objects";

export interface Room {
  readonly id: RoomId;
  readonly name: string;
  readonly isPrivate: boolean;
  readonly createdAt: Date;
  readonly createdBy: UserId;
}

interface CreateRoomParams {
  id: RoomId;
  name: string;
  isPrivate?: boolean;
  createdAt: Date;
  createdBy: UserId;
}

const ROOM_NAME_MIN = 1;
const ROOM_NAME_MAX = 80;

export function createRoom(params: CreateRoomParams): Room {
  const trimmedName = params.name.trim();
  if (trimmedName.length < ROOM_NAME_MIN || trimmedName.length > ROOM_NAME_MAX) {
    throw new ValidationError(
      `room name must be between ${ROOM_NAME_MIN} and ${ROOM_NAME_MAX} characters`
    );
  }

  return {
    id: params.id,
    name: trimmedName,
    isPrivate: params.isPrivate ?? false,
    createdAt: params.createdAt,
    createdBy: params.createdBy
  };
}
