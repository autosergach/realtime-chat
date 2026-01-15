import { createUserId } from "../../domain";
import { NotFoundError } from "../errors";
import { type RoomSummary } from "../dto/rooms";
import { type RoomRepository, type UserRepository } from "../ports/repositories";

interface ListRoomsDeps {
  rooms: RoomRepository;
  users: UserRepository;
}

export async function listRooms(
  deps: ListRoomsDeps,
  userId: string
): Promise<RoomSummary[]> {
  const resolvedUserId = createUserId(userId);
  const user = await deps.users.findById(resolvedUserId);
  if (!user) {
    throw new NotFoundError("user not found");
  }

  const rooms = await deps.rooms.listForUser(resolvedUserId);
  return rooms.map((room) => ({
    id: room.id,
    name: room.name,
    isPrivate: room.isPrivate
  }));
}
