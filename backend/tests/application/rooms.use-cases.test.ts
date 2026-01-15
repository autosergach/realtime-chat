import { describe, expect, it } from "vitest";
import { createPasswordHash, createRoom, createUser } from "../../src/domain"
import { NotFoundError } from "../../src/application/errors"
import { createRoomUseCase } from "../../src/application/use-cases/create-room"
import { joinRoom } from "../../src/application/use-cases/join-room"
import { listRooms } from "../../src/application/use-cases/list-rooms"
import {
  FixedClock,
  InMemoryRoomRepository,
  InMemoryUserRepository,
  StaticIdGenerator,
  ids,
  emails
} from "../helpers/fakes";

const clock = new FixedClock(new Date("2024-01-01T00:00:00Z"));

function createDeps() {
  return {
    rooms: new InMemoryRoomRepository(),
    users: new InMemoryUserRepository(),
    idGenerator: new StaticIdGenerator(ids.user, ids.room, ids.message),
    clock
  };
}

describe("room use cases", () => {
  it("creates room for existing user", async () => {
    const deps = createDeps();
    await deps.users.save(
      createUser({
        id: ids.user,
        email: emails.primary,
        passwordHash: createPasswordHash("hashed:secret"),
        createdAt: clock.now(),
        lastSeenAt: null
      })
    );

    const room = await createRoomUseCase(deps, {
      name: "General",
      createdBy: ids.user,
      isPrivate: false
    });

    expect(room.id).toBe(ids.room);
  });

  it("fails when creator is missing", async () => {
    const deps = createDeps();

    await expect(
      createRoomUseCase(deps, {
        name: "General",
        createdBy: ids.user,
        isPrivate: false
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("join room is idempotent", async () => {
    const deps = createDeps();
    await deps.users.save(
      createUser({
        id: ids.user,
        email: emails.primary,
        passwordHash: createPasswordHash("hashed:secret"),
        createdAt: clock.now(),
        lastSeenAt: null
      })
    );
    await deps.rooms.save(
      createRoom({
        id: ids.room,
        name: "General",
        createdAt: clock.now(),
        createdBy: ids.user
      })
    );

    await joinRoom(deps, { roomId: ids.room, userId: ids.user });
    await joinRoom(deps, { roomId: ids.room, userId: ids.user });

    expect(await deps.rooms.isMember(ids.room, ids.user)).toBe(true);
  });

  it("lists rooms for user", async () => {
    const deps = createDeps();
    await deps.users.save(
      createUser({
        id: ids.user,
        email: emails.primary,
        passwordHash: createPasswordHash("hashed:secret"),
        createdAt: clock.now(),
        lastSeenAt: null
      })
    );
    await deps.rooms.save(
      createRoom({
        id: ids.room,
        name: "General",
        createdAt: clock.now(),
        createdBy: ids.user
      })
    );
    await deps.rooms.addMember(ids.room, ids.user, clock.now());

    const rooms = await listRooms(deps, ids.user);

    expect(rooms).toHaveLength(1);
    expect(rooms[0]?.id).toBe(ids.room);
  });
});
