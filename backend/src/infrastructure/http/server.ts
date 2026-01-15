import Fastify from "fastify";
import cors from "@fastify/cors";
import { type Clock } from "../../application/ports/clock"
import { type IdGenerator } from "../../application/ports/ids"
import {
  type MessageRepository,
  type RoomRepository,
  type UserRepository
} from "../../application/ports/repositories";
import { type PasswordHasher, type TokenIssuer } from "../../application/ports/security"
import { env } from "../config/env";
import { errorHandler } from "./error-handler"
import { attachTraceId } from "./trace"
import { registerAuthRoutes } from "./routes/auth"
import { registerRoomRoutes } from "./routes/rooms"

export interface HttpDependencies {
  users: UserRepository;
  rooms: RoomRepository;
  messages: MessageRepository;
  passwordHasher: PasswordHasher;
  tokenIssuer: TokenIssuer;
  idGenerator: IdGenerator;
  clock: Clock;
}

export function createServer(deps: HttpDependencies) {
  const app = Fastify({ logger: true });

  app.setErrorHandler(errorHandler);
  app.addHook("onRequest", attachTraceId);
  app.register(cors, {
    origin: env.corsOrigin,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["content-type", "authorization"],
    credentials: false
  });

  app.get("/health", async () => ({ status: "ok" }));

  registerAuthRoutes(app, deps);
  registerRoomRoutes(app, deps);

  return app;
}
