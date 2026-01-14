import { NavLink, Outlet } from "react-router-dom";

export function AppShell() {
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
          <strong>alex@company.com</strong>
        </div>
      </aside>
      <main className="shell__content">
        <Outlet />
      </main>
    </div>
  );
}
