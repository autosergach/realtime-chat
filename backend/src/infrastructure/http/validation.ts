import { ZodError, type ZodSchema } from "zod";

export function parseWithSchema<T>(schema: ZodSchema<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}

export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}
