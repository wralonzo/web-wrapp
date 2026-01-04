import { inject, Directive } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { LoggerService } from '@core/services/logger.service';
import { NavigationService } from '@core/services/navigation.service';

@Directive() // Requerido por Angular para clases base que usan inyección
export abstract class PageConfiguration {
  // Inyecciones comunes
  protected nav = inject(NavigationService);
  protected authService = inject(AuthService);
  protected logger = inject(LoggerService);

  // Acceso fácil al diccionario de rutas
  public readonly ROUTES = APP_ROUTES;

  // Lógica común, por ejemplo, verificar si el usuario tiene permiso
  /**
   * Verifica si el usuario actual tiene uno o varios roles.
   * @param requiredRoles Puede ser un string único 'admin' o un array ['admin', 'vendor']
   */
  public hasRole(requiredRoles: string | string[]): boolean {
    const userRoles = this.authService.currentUser()?.roles;

    // Si no hay usuario o no tiene roles, denegar
    if (!userRoles) return false;

    // Si recibimos un string, lo convertimos en array para procesarlo igual
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    // Retorna true si AL MENOS UNO de los roles del usuario coincide con los requeridos
    return userRoles.some((role) => rolesArray.includes(role));
  }
}
