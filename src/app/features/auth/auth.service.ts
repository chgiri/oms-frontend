import { Injectable, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { AuthResponse, LoginRequest, Role } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  readonly currentUser = computed(() => this.tokenStorage.session());
  readonly isAuthenticated = computed(() => this.tokenStorage.session() !== null);

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) =>
        this.tokenStorage.setSession({
          accessToken: response.accessToken,
          username: response.username,
          role: response.role,
        }),
      ),
    );
  }

  logout(): void {
    // Fire-and-forget: even if this request fails (e.g. token already expired),
    // we still want to clear the local session and boot the user to login.
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
      next: () => this.tokenStorage.clearSession(),
      error: () => this.tokenStorage.clearSession(),
    });
  }

  hasRole(...allowed: Role[]): boolean {
    const role = this.tokenStorage.session()?.role;
    return !!role && allowed.includes(role);
  }
}
