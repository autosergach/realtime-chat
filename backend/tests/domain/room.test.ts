import { describe, expect, it } from "vitest";
import { createRoom } from "../../src/domain";
import { ids } from "../helpers/fakes";

describe("room", () => {
  it("trims and creates room", () => {
    const room = createRoom({
      id: ids.room,
      name: "  General  ",
      createdAt: new Date("2024-01-01"),
      createdBy: ids.user
    });

    expect(room.name).toBe("General");
    expect(room.isPrivate).toBe(false);
  });

  it("rejects invalid room name", () => {
    expect(() =>
      createRoom({
        id: ids.room,
        name: "",
        createdAt: new Date("2024-01-01"),
        createdBy: ids.user
      })
    ).toThrow("room name must be between 1 and 80 characters");
  });
});
