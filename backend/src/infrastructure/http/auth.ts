import { UnauthorizedError } from "../../application/errors"
import { type FastifyRequest } from "fastify";

export function requireUserId(request: FastifyRequest): string {
  const header = request.headers["x-user-id"];
  if (!header) {
    throw new UnauthorizedError("missing x-user-id header");
  }
  if (Array.isArray(header)) {
    throw new UnauthorizedError("invalid x-user-id header");
  }
  const value = header.trim();
  if (!value) {
    throw new UnauthorizedError("invalid x-user-id header");
  }
  return value;
}
