import { type FastifyInstance } from "fastify";
import { z } from "zod";
import { loginUser } from "../../../application/use-cases/login-user"
import { registerUser } from "../../../application/use-cases/register-user"
import { parseWithSchema } from "../validation"
import { type HttpDependencies } from "../server"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export function registerAuthRoutes(app: FastifyInstance, deps: HttpDependencies) {
  app.post("/auth/register", async (request, reply) => {
    const body = parseWithSchema(registerSchema, request.body);
    const response = await registerUser(deps, body);
    reply.status(201).send(response);
  });

  app.post("/auth/login", async (request, reply) => {
    const body = parseWithSchema(loginSchema, request.body);
    const response = await loginUser(deps, body);
    reply.status(200).send(response);
  });
}
