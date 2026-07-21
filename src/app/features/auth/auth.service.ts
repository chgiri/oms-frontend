import { Injectable, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { AuthResponse, LoginRequest, Role } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

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
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
      next: () => this.completeLogout(),
      error: () => this.completeLogout(),
    });
  }

  private completeLogout(): void {
    this.tokenStorage.clearSession();
    this.router.navigateByUrl('/login');
  }

  hasRole(...allowed: Role[]): boolean {
    const role = this.tokenStorage.session()?.role;
    return !!role && allowed.includes(role);
  }
}
