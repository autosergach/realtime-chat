import { createRoom, createUserId } from "../../domain"
import { NotFoundError } from "../errors"
import { type CreateRoomRequest, type RoomSummary } from "../dto/rooms"
import { type Clock } from "../ports/clock"
import { type IdGenerator } from "../ports/ids"
import { type RoomRepository, type UserRepository } from "../ports/repositories"

interface CreateRoomDeps {
  rooms: RoomRepository;
  users: UserRepository;
  idGenerator: IdGenerator;
  clock: Clock;
}

export async function createRoomUseCase(
  deps: CreateRoomDeps,
  request: CreateRoomRequest
): Promise<RoomSummary> {
  const creatorId = createUserId(request.createdBy);
  const creator = await deps.users.findById(creatorId);
  if (!creator) {
    throw new NotFoundError("creator not found");
  }

  const roomId = deps.idGenerator.nextRoomId();
  const room = createRoom({
    id: roomId,
    name: request.name,
    isPrivate: request.isPrivate,
    createdAt: deps.clock.now(),
    createdBy: creator.id
  });

  await deps.rooms.save(room);
  await deps.rooms.addMember(room.id, creator.id, deps.clock.now());

  return {
    id: room.id,
    name: room.name,
    isPrivate: room.isPrivate
  };
}
