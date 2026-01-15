import { type FastifyRequest } from "fastify";
import { verifyJwt } from "./jwt";

export function requireUserId(request: FastifyRequest): string {
  return verifyJwt(request.headers.authorization);
}
