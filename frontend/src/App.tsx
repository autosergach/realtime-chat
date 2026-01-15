import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { AuthPage } from "./pages/AuthPage";
import { RoomsPage } from "./pages/RoomsPage";
import { ChatPage } from "./pages/ChatPage";
import { AuthProvider, useAuth } from "./state/auth";

function RequireAuth() {
  const { session } = useAuth();
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:roomId" element={<ChatPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
