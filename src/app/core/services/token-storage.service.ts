import { Injectable, signal } from '@angular/core';
import { AuthSession } from '../../features/auth/auth.model';

const SESSION_KEY = 'oms_auth_session';

function readStoredSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as AuthSession) : null;
}

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  readonly session = signal<AuthSession | null>(readStoredSession());

  setSession(session: AuthSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.session.set(session);
  }

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    this.session.set(null);
  }

  getToken(): string | null {
    return this.session()?.accessToken ?? null;
  }
}
