import { type PasswordHash, type UserId } from "../../domain"

export interface PasswordHasher {
  hash(password: string): Promise<PasswordHash>;
  verify(password: string, hash: PasswordHash): Promise<boolean>;
}

export interface TokenIssuer {
  issueAccessToken(userId: UserId): Promise<string>;
}
