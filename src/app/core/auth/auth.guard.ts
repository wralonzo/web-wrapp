import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { RustDataService } from '@core/rust/rust-data.service';
import { filter, firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const rustData = inject(RustDataService);
  // Obtenemos el usuario directamente del Signal sincronizado con Rust
  const user = rustData.currentUser();
  const isAuthenticated = rustData.isAuthenticated();


  // ESPERA ACTIVA: Si el bridge no está listo, esperamos a que initialize() termine.
  // Esto resuelve el problema de "AuthBridge no está listo"
  if (!rustData.initialize()) {
    await firstValueFrom(
      rustData.initialized$.pipe(filter(ready => ready))
    );
  }

  // 1. SI NO HAY USUARIO O NO ESTÁ AUTENTICADO
  if (!user || !isAuthenticated) {
    console.warn('Sesión no encontrada o expirada. Redirigiendo al login...');
    return router.parseUrl(APP_ROUTES.nav.login);
  }

  // 2. OBTENER ROLES REQUERIDOS
  const requiredRoles = route.data['rols'] as string[];

  // Si la ruta no pide roles específicos (ej: Dashboard), permitir acceso
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // 3. VERIFICACIÓN DE ROLES (Safe navigation con roles!)
  // Usamos el operador ? para evitar errores si roles viene indefinido por algún motivo
  const userRoles = user?.user?.roles ?? [];
  const hasPermission = userRoles.some((role: string) => requiredRoles.includes(role));

  if (hasPermission) {
    return true;
  }

  // 4. ACCESO DENEGADO
  console.error(`Acceso denegado. Se requiere: ${requiredRoles}. Usuario tiene: ${userRoles}`);

  // Redirigir al dashboard para evitar que el usuario se quede "atrapado"
  return router.parseUrl(APP_ROUTES.nav.dashboard);
};
