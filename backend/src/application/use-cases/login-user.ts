import { createEmail } from "../../domain";
import { UnauthorizedError } from "../errors";
import { type AuthResponse, type LoginRequest } from "../dto/auth";
import { type Clock } from "../ports/clock";
import { type UserRepository } from "../ports/repositories";
import { type PasswordHasher, type TokenIssuer } from "../ports/security";

interface LoginUserDeps {
  users: UserRepository;
  passwordHasher: PasswordHasher;
  tokenIssuer: TokenIssuer;
  clock: Clock;
}

export async function loginUser(
  deps: LoginUserDeps,
  request: LoginRequest
): Promise<AuthResponse> {
  const email = createEmail(request.email);
  const user = await deps.users.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError("invalid credentials");
  }

  const isValid = await deps.passwordHasher.verify(request.password, user.passwordHash);
  if (!isValid) {
    throw new UnauthorizedError("invalid credentials");
  }

  const now = deps.clock.now();
  await deps.users.updateLastSeen(user.id, now);

  const accessToken = await deps.tokenIssuer.issueAccessToken(user.id);
  return {
    accessToken,
    userId: user.id
  };
}
