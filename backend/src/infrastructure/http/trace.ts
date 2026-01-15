import { type FastifyReply, type FastifyRequest } from "fastify";

export function attachTraceId(request: FastifyRequest, reply: FastifyReply, done: () => void) {
  reply.header("x-trace-id", String(request.id));
  done();
}
