import { describe, expect, it } from "vitest";
import { createEmail, createPasswordHash, createUser } from "../../src/domain";
import { ConflictError, UnauthorizedError } from "../../src/application/errors";
import { loginUser } from "../../src/application/use-cases/login-user";
import { registerUser } from "../../src/application/use-cases/register-user";
import {
  AcceptAllHasher,
  FixedClock,
  InMemoryUserRepository,
  StaticIdGenerator,
  StaticTokenIssuer,
  emails,
  ids
} from "../helpers/fakes";

const clock = new FixedClock(new Date("2024-01-01T00:00:00Z"));

function createDeps() {
  return {
    users: new InMemoryUserRepository(),
    passwordHasher: new AcceptAllHasher(),
    tokenIssuer: new StaticTokenIssuer("token-1"),
    idGenerator: new StaticIdGenerator(ids.user, ids.room, ids.message),
    clock
  };
}

describe("auth use cases", () => {
  it("registers a new user", async () => {
    const deps = createDeps();

    const response = await registerUser(deps, {
      email: "user@example.com",
      password: "secret"
    });

    expect(response.accessToken).toBe("token-1");
    expect(response.userId).toBe(ids.user);
  });

  it("rejects duplicate registration", async () => {
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

    await expect(
      registerUser(deps, {
        email: "user@example.com",
        password: "secret"
      })
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("rejects invalid credentials", async () => {
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

    await expect(
      loginUser(deps, {
        email: "user@example.com",
        password: "wrong"
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("logs in with correct password", async () => {
    const deps = createDeps();
    await deps.users.save(
      createUser({
        id: ids.user,
        email: createEmail("user@example.com"),
        passwordHash: createPasswordHash("hashed:secret"),
        createdAt: clock.now(),
        lastSeenAt: null
      })
    );

    const response = await loginUser(deps, {
      email: "user@example.com",
      password: "secret"
    });

    expect(response.accessToken).toBe("token-1");
  });
});
