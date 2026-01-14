import { type Email } from "../../domain";

export interface RegisterRequest {
  email: Email;
  password: string;
}

export interface LoginRequest {
  email: Email;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  userId: string;
}
