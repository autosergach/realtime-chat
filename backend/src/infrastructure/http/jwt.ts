import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../application/errors";
import { env } from "../config/env";

export interface JwtPayload {
  sub: string;
}

export function verifyJwt(authHeader: string | undefined): string {
  if (!authHeader) {
    throw new UnauthorizedError("missing authorization header");
  }
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new UnauthorizedError("invalid authorization header");
  }
  const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
  if (!decoded?.sub) {
    throw new UnauthorizedError("invalid token");
  }
  return decoded.sub;
}
