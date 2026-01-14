export class DomainError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message);
  }
}

export class InvariantViolation extends DomainError {
  constructor(message: string) {
    super("INVARIANT_VIOLATION", message);
  }
}
