import { type FastifyInstance } from "fastify";
import { z } from "zod";
import { createRoomUseCase } from "../../../application/use-cases/create-room"
import { joinRoom } from "../../../application/use-cases/join-room"
import { listMessages } from "../../../application/use-cases/list-messages"
import { listRooms } from "../../../application/use-cases/list-rooms"
import { sendMessage } from "../../../application/use-cases/send-message"
import { requireUserId } from "../auth"
import { type HttpDependencies } from "../server"
import { parseWithSchema } from "../validation"

const createRoomSchema = z.object({
  name: z.string().min(1).max(80),
  isPrivate: z.boolean().optional()
});

const joinRoomParamsSchema = z.object({
  roomId: z.string().min(1)
});

const messageParamsSchema = z.object({
  roomId: z.string().min(1)
});

const sendMessageSchema = z.object({
  messageId: z.string().min(1),
  content: z.string().min(1).max(1000)
});

const listMessagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50)
});

export function registerRoomRoutes(app: FastifyInstance, deps: HttpDependencies) {
  app.get("/rooms", async (request, reply) => {
    const userId = requireUserId(request);
    const rooms = await listRooms(deps, userId);
    reply.status(200).send(rooms);
  });

  app.post("/rooms", async (request, reply) => {
    const body = parseWithSchema(createRoomSchema, request.body);
    const userId = requireUserId(request);
    const room = await createRoomUseCase(deps, {
      name: body.name,
      isPrivate: body.isPrivate,
      createdBy: userId
    });
    reply.status(201).send(room);
  });

  app.post("/rooms/:roomId/join", async (request, reply) => {
    const params = parseWithSchema(joinRoomParamsSchema, request.params);
    const userId = requireUserId(request);
    await joinRoom(deps, { roomId: params.roomId, userId });
    reply.status(204).send();
  });

  app.get("/rooms/:roomId/messages", async (request, reply) => {
    const params = parseWithSchema(messageParamsSchema, request.params);
    const query = parseWithSchema(listMessagesQuerySchema, request.query);
    const userId = requireUserId(request);
    const limit = query.limit ?? 50;
    const messages = await listMessages(deps, {
      roomId: params.roomId,
      userId,
      limit
    });
    reply.status(200).send(messages);
  });

  app.post("/rooms/:roomId/messages", async (request, reply) => {
    const params = parseWithSchema(messageParamsSchema, request.params);
    const body = parseWithSchema(sendMessageSchema, request.body);
    const userId = requireUserId(request);
    const message = await sendMessage(deps, {
      roomId: params.roomId,
      authorId: userId,
      messageId: body.messageId,
      content: body.content
    });
    reply.status(201).send(message);
  });
}
