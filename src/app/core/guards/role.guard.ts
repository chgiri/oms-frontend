import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';
import { Role } from '../../features/auth/auth.model';

export function roleGuard(...allowed: Role[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasRole(...allowed)) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
}
