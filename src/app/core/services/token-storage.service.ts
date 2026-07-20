import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'oms_access_token';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  // A signal so components (e.g. "is logged in?" in the toolbar) can react
  // to login/logout without manually subscribing to anything.
  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.token.set(token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
  }

  getToken(): string | null {
    return this.token();
  }
}