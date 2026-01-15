import "dotenv/config";
import { env } from "./infrastructure/config/env";
import { createRealtimeGateway } from "./infrastructure/realtime/gateway";
import { createServer } from "./infrastructure/http/server";
import { PrismaMessageRepository, PrismaRoomRepository, PrismaUserRepository } from "./infrastructure/persistence/prisma/repositories";
import { ArgonPasswordHasher, JwtTokenIssuer } from "./infrastructure/security/auth";
import { RandomIdGenerator } from "./infrastructure/ids";
import { SystemClock } from "./infrastructure/clock";

async function start() {
  const deps = {
    users: new PrismaUserRepository(),
    rooms: new PrismaRoomRepository(),
    messages: new PrismaMessageRepository(),
    passwordHasher: new ArgonPasswordHasher(),
    tokenIssuer: new JwtTokenIssuer(),
    idGenerator: new RandomIdGenerator(),
    clock: new SystemClock()
  };

  const app = createServer(deps);
  createRealtimeGateway(app.server, deps);

  await app.listen({ port: env.port, host: "0.0.0.0" });
  app.log.info(`HTTP server listening on ${env.port}`);
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
