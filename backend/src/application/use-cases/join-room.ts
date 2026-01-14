import { createRoomId, createUserId } from "../../domain";
import { NotFoundError } from "../errors";
import { type JoinRoomRequest } from "../dto/rooms";
import { type Clock } from "../ports/clock";
import { type RoomRepository, type UserRepository } from "../ports/repositories";

interface JoinRoomDeps {
  rooms: RoomRepository;
  users: UserRepository;
  clock: Clock;
}

export async function joinRoom(
  deps: JoinRoomDeps,
  request: JoinRoomRequest
): Promise<void> {
  const roomId = createRoomId(request.roomId);
  const userId = createUserId(request.userId);

  const room = await deps.rooms.findById(roomId);
  if (!room) {
    throw new NotFoundError("room not found");
  }

  const user = await deps.users.findById(userId);
  if (!user) {
    throw new NotFoundError("user not found");
  }

  const alreadyMember = await deps.rooms.isMember(room.id, user.id);
  if (alreadyMember) {
    return;
  }

  await deps.rooms.addMember(room.id, user.id, deps.clock.now());
}
