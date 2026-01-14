import { type FastifyError, type FastifyReply, type FastifyRequest } from "fastify";
import { ApplicationError } from "../../application/errors"
import { DomainError } from "../../domain"
import { type ErrorResponse } from "./types"
import { isZodError } from "./validation"

function toErrorResponse(code: string, message: string, traceId: string): ErrorResponse {
  return { code, message, traceId };
}

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  const traceId = String(request.id);

  if (error instanceof ApplicationError) {
    const status = error.code === "UNAUTHORIZED" ? 401 : error.code === "NOT_FOUND" ? 404 : 409;
    reply.status(status).send(toErrorResponse(error.code, error.message, traceId));
    return;
  }

  if (error instanceof DomainError) {
    reply.status(400).send(toErrorResponse(error.code, error.message, traceId));
    return;
  }

  if (isZodError(error)) {
    reply
      .status(400)
      .send(toErrorResponse("VALIDATION_ERROR", error.issues[0]?.message ?? "invalid input", traceId));
    return;
  }

  request.log.error({ err: error }, "Unhandled error");
  reply.status(500).send(toErrorResponse("INTERNAL_ERROR", "unexpected error", traceId));
}
