import { createEmail, createUser } from "../../domain"
import { ConflictError } from "../errors"
import { type AuthResponse, type RegisterRequest } from "../dto/auth"
import { type Clock } from "../ports/clock"
import { type IdGenerator } from "../ports/ids"
import { type UserRepository } from "../ports/repositories"
import { type PasswordHasher, type TokenIssuer } from "../ports/security"

interface RegisterUserDeps {
  users: UserRepository;
  passwordHasher: PasswordHasher;
  tokenIssuer: TokenIssuer;
  idGenerator: IdGenerator;
  clock: Clock;
}

export async function registerUser(
  deps: RegisterUserDeps,
  request: RegisterRequest
): Promise<AuthResponse> {
  const email = createEmail(request.email);
  const existing = await deps.users.findByEmail(email);
  if (existing) {
    throw new ConflictError("user already exists");
  }

  const passwordHash = await deps.passwordHasher.hash(request.password);
  const userId = deps.idGenerator.nextUserId();
  const user = createUser({
    id: userId,
    email,
    passwordHash,
    createdAt: deps.clock.now(),
    lastSeenAt: null
  });

  await deps.users.save(user);

  const accessToken = await deps.tokenIssuer.issueAccessToken(user.id);
  return {
    accessToken,
    userId: user.id
  };
}
