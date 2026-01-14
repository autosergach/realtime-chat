import { type Email, type PasswordHash, type UserId } from "./value-objects";

export interface User {
  readonly id: UserId;
  readonly email: Email;
  readonly passwordHash: PasswordHash;
  readonly createdAt: Date;
  readonly lastSeenAt: Date | null;
}

interface CreateUserParams {
  id: UserId;
  email: Email;
  passwordHash: PasswordHash;
  createdAt: Date;
  lastSeenAt?: Date | null;
}

export function createUser(params: CreateUserParams): User {
  return {
    id: params.id,
    email: params.email,
    passwordHash: params.passwordHash,
    createdAt: params.createdAt,
    lastSeenAt: params.lastSeenAt ?? null
  };
}

export function markUserOnline(user: User, now: Date): User {
  return {
    ...user,
    lastSeenAt: now
  };
}
