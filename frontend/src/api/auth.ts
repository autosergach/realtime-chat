import { postJson } from "./http";

export interface AuthResponse {
  accessToken: string;
  userId: string;
}

export async function registerUser(apiUrl: string, email: string, password: string) {
  return postJson<AuthResponse>(`${apiUrl}/auth/register`, { email, password });
}

export async function loginUser(apiUrl: string, email: string, password: string) {
  return postJson<AuthResponse>(`${apiUrl}/auth/login`, { email, password });
}
