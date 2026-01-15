import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../state/auth";

export function AppShell() {
  const { session, signOut } = useAuth();
  return (
    <div className="shell">
      <aside className="shell__nav">
        <div className="brand">Realtime Chat</div>
        <nav>
          <NavLink to="/rooms">Rooms</NavLink>
          <NavLink to="/chat">Chat</NavLink>
        </nav>
        <div className="shell__foot">
          <span className="muted">Connected as</span>
          <strong>{session?.userId ?? "unknown"}</strong>
          <button className="ghost" onClick={signOut}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="shell__content">
        <Outlet />
      </main>
    </div>
  );
}
