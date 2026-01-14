import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { createServer as createHttpServer } from "node:http";
import { io as createClient, type Socket as ClientSocket } from "socket.io-client";
import { createRealtimeGateway } from "../../src/infrastructure/realtime/gateway";
import {
  InMemoryMessageRepository,
  InMemoryRoomRepository,
  InMemoryUserRepository,
  FixedClock,
  ids,
  emails
} from "../helpers/fakes";
import { createRoom, createUser, createPasswordHash } from "../../src/domain";

describe("realtime gateway", () => {
  let socket: ClientSocket;
  let server: ReturnType<typeof createHttpServer>;
  let baseUrl: string;

  beforeEach(async () => {
    server = createHttpServer();
    const rooms = new InMemoryRoomRepository();
    const users = new InMemoryUserRepository();
    const messages = new InMemoryMessageRepository();
    const clock = new FixedClock(new Date("2024-01-01T00:00:00Z"));
    createRealtimeGateway(server, { rooms, users, messages, clock });

    await new Promise<void>((resolve) => {
      server.listen(() => resolve());
    });

    const address = server.address();
    if (typeof address === "string" || !address) {
      throw new Error("Invalid server address");
    }
    baseUrl = `http://localhost:${address.port}`;

    await users.save(
      createUser({
        id: ids.user,
        email: emails.primary,
        passwordHash: createPasswordHash("hashed:secret"),
        createdAt: clock.now(),
        lastSeenAt: null
      })
    );
    await rooms.save(
      createRoom({
        id: ids.room,
        name: "General",
        createdAt: clock.now(),
        createdBy: ids.user
      })
    );
    await rooms.addMember(ids.room, ids.user, clock.now());
  });

  afterEach(async () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("joins room and receives room_joined", async () => {
    socket = createClient(baseUrl, {
      extraHeaders: {
        "x-user-id": ids.user
      }
    });

    const joined = new Promise<void>((resolve) => {
      socket.on("server_event", (event) => {
        if (event.type === "room_joined") {
          expect(event.payload.roomId).toBe(ids.room);
          resolve();
        }
      });
    });

    socket.emit("client_event", {
      type: "join_room",
      payload: { roomId: ids.room }
    });

    await joined;
  });

  it("broadcasts message to room", async () => {
    socket = createClient(baseUrl, {
      extraHeaders: {
        "x-user-id": ids.user
      }
    });

    const messageReceived = new Promise<void>((resolve) => {
      socket.on("server_event", (event) => {
        if (event.type === "message") {
          expect(event.payload.message.content).toBe("Hello");
          resolve();
        }
      });
    });

    socket.emit("client_event", {
      type: "join_room",
      payload: { roomId: ids.room }
    });

    socket.emit("client_event", {
      type: "send_message",
      payload: {
        roomId: ids.room,
        messageId: ids.message,
        content: "Hello"
      }
    });

    await messageReceived;
  });
});
