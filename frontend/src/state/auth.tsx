import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { loginUser, registerUser } from "../api/auth";

interface Session {
  userId: string;
  accessToken: string;
}

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "realtime-chat.session";

function loadSession(): Session | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function saveSession(session: Session | null) {
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function getApiUrl() {
  return import.meta.env.VITE_API_URL ?? "http://localhost:3000";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(getApiUrl(), email, password);
      setSession(response);
      saveSession(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(getApiUrl(), email, password);
      setSession(response);
      saveSession(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register");
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    saveSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, loading, error, signIn, signUp, signOut }),
    [session, loading, error, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
