import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ChatPage } from "../src/pages/ChatPage";

vi.mock("../src/state/auth", () => {
  return {
    useAuth: () => ({
      session: { userId: "user-1", accessToken: "token" }
    })
  };
});

vi.mock("../src/hooks/useSocket", () => {
  return {
    useSocket: () => ({
      socket: null,
      connected: false
    })
  };
});

vi.mock("../src/api/rooms", () => {
  return {
    listMessages: vi.fn().mockResolvedValue([])
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useParams: () => ({ roomId: "room-1" })
  };
});

describe("ChatPage", () => {
  it("renders chat header", async () => {
    render(<ChatPage />);

    await waitFor(() => {
      expect(screen.getByText("Realtime delivery room")).toBeInTheDocument();
    });
  });
});
