export type Role = 'ADMIN' | 'MANAGER' | 'STAFF';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  username: string;
  role: Role;
}

export interface AuthSession {
  accessToken: string;
  username: string;
  role: Role;
}