import { describe, expect, it } from "vitest";
import { createMessage, createPasswordHash, createRoom, createUser } from "../../src/domain";
import { UnauthorizedError } from "../../src/application/errors";
import { listMessages } from "../../src/application/use-cases/list-messages";
import { sendMessage } from "../../src/application/use-cases/send-message";
import {
  FixedClock,
  InMemoryMessageRepository,
  InMemoryRoomRepository,
  InMemoryUserRepository,
  ids,
  emails
} from "../helpers/fakes";

const clock = new FixedClock(new Date("2024-01-01T00:00:00Z"));

function createDeps() {
  return {
    rooms: new InMemoryRoomRepository(),
    messages: new InMemoryMessageRepository(),
    users: new InMemoryUserRepository(),
    clock
  };
}

describe("message use cases", () => {
  it("returns existing message for idempotency", async () => {
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

    const message = createMessage({
      id: ids.message,
      roomId: ids.room,
      authorId: ids.user,
      content: "hello",
      createdAt: clock.now()
    });
    await deps.messages.save(message);

    const result = await sendMessage(deps, {
      roomId: ids.room,
      authorId: ids.user,
      messageId: ids.message,
      content: "should be ignored"
    });

    expect(result.content).toBe("hello");
  });

  it("rejects non-member listing", async () => {
    const deps = createDeps();
    await deps.rooms.save(
      createRoom({
        id: ids.room,
        name: "General",
        createdAt: clock.now(),
        createdBy: ids.user
      })
    );

    await expect(
      listMessages(deps, {
        roomId: ids.room,
        userId: ids.user,
        limit: 20
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
