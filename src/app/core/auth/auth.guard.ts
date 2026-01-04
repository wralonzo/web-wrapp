import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { APP_ROUTES } from '@core/constants/routes.constants';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  // 1. SI NO HAY USUARIO: Redirigir al Login
  if (!user) {
    return router.parseUrl(APP_ROUTES.nav.login);
  }

  // 2. OBTENER ROLES REQUERIDOS DE LA RUTA
  // Angular hereda la 'data' de las rutas padres a las hijas
  const requiredRoles = route.data['rols'] as string[];

  // Si la ruta no pide roles específicos (ej: Dashboard), permitir acceso
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // 3. LOGICA DE INTERSECCIÓN (Array vs Array)
  // Verificamos si al menos uno de los roles del usuario está en la lista permitida
  const hasPermission = user.roles!.some((role) => requiredRoles.includes(role));
  console.log(
    'Roles requeridos:',
    requiredRoles,
    'Roles del usuario:',
    user.roles,
    'Acceso permitido:',
    hasPermission
  );
  if (hasPermission) {
    return true;
  }

  // 4. SI NO TIENE PERMISO: Redirigir al Dashboard para romper el loop
  // Importante: El Dashboard debe ser accesible para todos los roles
  console.error(`Acceso denegado a ${state.url}. Roles del usuario:`, user.roles);
  return router.parseUrl(APP_ROUTES.nav.dashboard);
};
