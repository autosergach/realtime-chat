import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoomsPage } from "../src/pages/RoomsPage";

vi.mock("../src/state/auth", () => {
  return {
    useAuth: () => ({
      session: { userId: "user-1", accessToken: "token" }
    })
  };
});

vi.mock("../src/api/rooms", () => {
  return {
    listRooms: vi.fn().mockResolvedValue([
      { id: "room-1", name: "General", isPrivate: false }
    ]),
    createRoom: vi.fn()
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe("RoomsPage", () => {
  it("renders rooms from API", async () => {
    render(<RoomsPage />);

    expect(await screen.findByText("General")).toBeInTheDocument();
  });
});
