import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos el signal del servicio que creamos antes
  if (authService.currentUser()) {
    return true; // Usuario logueado, adelante
  }

  // Si no hay usuario, mandamos al login
  return router.parseUrl('/login');
};
