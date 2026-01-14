import { describe, expect, it } from "vitest";
import { createMessage } from "../../src/domain"
import { ids } from "../helpers/fakes"

describe("message", () => {
  it("trims message content", () => {
    const message = createMessage({
      id: ids.message,
      roomId: ids.room,
      authorId: ids.user,
      content: "  hello  ",
      createdAt: new Date("2024-01-01")
    });

    expect(message.content).toBe("hello");
  });

  it("rejects empty content", () => {
    expect(() =>
      createMessage({
        id: ids.message,
        roomId: ids.room,
        authorId: ids.user,
        content: "   ",
        createdAt: new Date("2024-01-01")
      })
    ).toThrow("message content must be between 1 and 1000 characters");
  });
});
