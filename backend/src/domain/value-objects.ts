import { ValidationError } from "./errors";
import { type Brand } from "./types";

export type UserId = Brand<string, "UserId">;
export type RoomId = Brand<string, "RoomId">;
export type MessageId = Brand<string, "MessageId">;
export type Email = Brand<string, "Email">;
export type PasswordHash = Brand<string, "PasswordHash">;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function assertNonEmpty(value: string, label: string): void {
  if (value.trim().length === 0) {
    throw new ValidationError(`${label} must not be empty`);
  }
}

export function createUserId(value: string): UserId {
  assertNonEmpty(value, "userId");
  return value as UserId;
}

export function createRoomId(value: string): RoomId {
  assertNonEmpty(value, "roomId");
  return value as RoomId;
}

export function createMessageId(value: string): MessageId {
  assertNonEmpty(value, "messageId");
  return value as MessageId;
}

export function createEmail(value: string): Email {
  assertNonEmpty(value, "email");
  const normalized = value.trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalized)) {
    throw new ValidationError("email format is invalid");
  }
  return normalized as Email;
}

export function createPasswordHash(value: string): PasswordHash {
  assertNonEmpty(value, "passwordHash");
  return value as PasswordHash;
}
