import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { type PasswordHasher, type TokenIssuer } from "../../application/ports/security";
import { type PasswordHash, type UserId } from "../../domain";
import { env } from "../config/env";

export class ArgonPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<PasswordHash> {
    const hash = await argon2.hash(password);
    return hash as PasswordHash;
  }

  async verify(password: string, hash: PasswordHash): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}

export class JwtTokenIssuer implements TokenIssuer {
  async issueAccessToken(userId: UserId): Promise<string> {
    return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: "1h" });
  }
}
