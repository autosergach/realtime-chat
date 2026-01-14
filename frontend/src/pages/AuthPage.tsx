import { useMemo, useState } from "react";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const title = useMemo(
    () => (mode === "login" ? "Welcome back" : "Create your account"),
    [mode]
  );

  return (
    <div className="page auth">
      <section className="panel">
        <header className="panel__header">
          <span className="eyebrow">Realtime Chat</span>
          <h1>{title}</h1>
          <p className="muted">
            {mode === "login"
              ? "Sign in to join your team rooms and continue the conversation."
              : "Register to start building your real-time workspace."}
          </p>
        </header>

        <div className="panel__body">
          <label className="field">
            <span>Email</span>
            <input type="email" placeholder="you@company.com" />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="••••••••" />
          </label>

          <button className="primary">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </div>

        <footer className="panel__footer">
          <span className="muted">
            {mode === "login" ? "New here?" : "Already have an account?"}
          </span>
          <button
            className="link"
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </footer>
      </section>
      <aside className="sidecard">
        <div className="sidecard__content">
          <h2>Live system insight</h2>
          <p>
            Designed to showcase realtime delivery guarantees, presence signals, and
            clean architectural boundaries.
          </p>
          <div className="stat">
            <span className="stat__label">Delivery</span>
            <span className="stat__value">At-least-once</span>
          </div>
          <div className="stat">
            <span className="stat__label">Ordering</span>
            <span className="stat__value">Best effort</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
