import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthPage } from "../src/pages/AuthPage";

vi.mock("../src/state/auth", () => {
  return {
    useAuth: () => ({
      signIn: vi.fn(),
      signUp: vi.fn(),
      loading: false,
      error: null
    })
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

describe("AuthPage", () => {
  it("toggles between login and register", async () => {
    render(<AuthPage />);

    expect(screen.getByText("Welcome back")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Create an account" }));

    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });
});
