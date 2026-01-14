import { describe, expect, it } from "vitest";
import { createEmail } from "../../src/domain";

describe("value objects", () => {
  it("normalizes email", () => {
    const email = createEmail("User@Example.com");
    expect(email).toBe("user@example.com");
  });

  it("rejects invalid email", () => {
    expect(() => createEmail("not-an-email")).toThrow("email format is invalid");
  });
});
