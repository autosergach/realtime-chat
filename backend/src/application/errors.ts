export class ApplicationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super("NOT_FOUND", message);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string) {
    super("CONFLICT", message);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message: string) {
    super("UNAUTHORIZED", message);
  }
}
