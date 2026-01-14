import { Server as SocketServer, type Socket } from "socket.io";
import { type Server as HttpServer } from "node:http";
import { z } from "zod";
import { type SendMessageRequest } from "../../application/dto/messages";
import { type JoinRoomRequest } from "../../application/dto/rooms";
import { joinRoom } from "../../application/use-cases/join-room";
import { sendMessage } from "../../application/use-cases/send-message";
import { type Clock } from "../../application/ports/clock";
import {
  type MessageRepository,
  type RoomRepository,
  type UserRepository
} from "../../application/ports/repositories";
import { type ClientToServerEvent, type ServerToClientEvent } from "./contracts";

export interface RealtimeDependencies {
  users: UserRepository;
  rooms: RoomRepository;
  messages: MessageRepository;
  clock: Clock;
}

const joinRoomSchema = z.object({
  roomId: z.string().min(1)
});

const sendMessageSchema = z.object({
  roomId: z.string().min(1),
  messageId: z.string().min(1),
  content: z.string().min(1).max(1000)
});

const typingSchema = z.object({
  roomId: z.string().min(1)
});

function requireUserId(socket: Socket): string {
  const header = socket.handshake.headers["x-user-id"];
  if (!header || Array.isArray(header)) {
    throw new Error("missing x-user-id header");
  }
  return String(header);
}

export function createRealtimeGateway(httpServer: HttpServer, deps: RealtimeDependencies) {
  const io = new SocketServer(httpServer, {
    transports: ["polling", "websocket"]
  });

  io.on("connection", (socket) => {
    socket.on("client_event", async (event: ClientToServerEvent) => {
      try {
        const userId = requireUserId(socket);

        if (event.type === "join_room") {
          const payload = joinRoomSchema.parse(event.payload);
          const request: JoinRoomRequest = {
            roomId: payload.roomId,
            userId
          };
          await joinRoom(deps, request);
          await socket.join(payload.roomId);
          const response: ServerToClientEvent = {
            type: "room_joined",
            payload: { roomId: payload.roomId }
          };
          socket.emit("server_event", response);
          return;
        }

        if (event.type === "send_message") {
          const payload = sendMessageSchema.parse(event.payload);
          const request: SendMessageRequest = {
            roomId: payload.roomId,
            authorId: userId,
            messageId: payload.messageId,
            content: payload.content
          };
          const message = await sendMessage(deps, request);
          const response: ServerToClientEvent = {
            type: "message",
            payload: {
              roomId: payload.roomId,
              message: {
                id: message.id,
                authorId: message.authorId,
                content: message.content,
                createdAt: message.createdAt.toISOString()
              }
            }
          };
          io.to(payload.roomId).emit("server_event", response);
          return;
        }

        if (event.type === "typing") {
          const payload = typingSchema.parse(event.payload);
          const response: ServerToClientEvent = {
            type: "presence_update",
            payload: {
              userId,
              status: "online",
              lastSeenAt: deps.clock.now().toISOString()
            }
          };
          socket.to(payload.roomId).emit("server_event", response);
          return;
        }
      } catch (error) {
        const response: ServerToClientEvent = {
          type: "error",
          payload: {
            code: "REALTIME_ERROR",
            message: error instanceof Error ? error.message : "unexpected error",
            traceId: String(socket.id)
          }
        };
        socket.emit("server_event", response);
      }
    });
  });

  return io;
}
