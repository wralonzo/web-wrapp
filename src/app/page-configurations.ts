import { inject, Directive, OnInit } from '@angular/core';
import { AppError } from '@assets/retail-shop/AppError';
import { AuthService } from '@core/auth/auth.service';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { RustService } from '@core/rust/rust.service';
import { LoggerService } from '@core/services/logger.service';
import { NavigationService } from '@core/services/navigation.service';
import { ToastService } from '@core/services/toast.service';

@Directive() // Requerido por Angular para clases base que usan inyección
export abstract class PageConfiguration {
  // Inyecciones comunes
  protected nav = inject(NavigationService);
  protected authService = inject(AuthService);
  protected logger = inject(LoggerService);
  protected toast = inject(ToastService);
  protected readonly rustSerive = inject(RustService);

  // Acceso fácil al diccionario de rutas
  protected readonly ROUTES = APP_ROUTES;

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

  public async provideError(error: any) {
    // ❌ sin conexión
    // Si el error no tiene la estructura de AppError
    if (!error || !error.type) {
      return 'Ha ocurrido un error inesperado.';
    }

    const appError = error as AppError;

    switch (appError.type) {
      case 'ApiError':
        if(appError.payload.code === 401){

          //redirect login 
        }
        return `${appError.payload.message} (${appError.payload.error_api})`;
      case 'NetworkError':
        return 'Sin conexión con el servidor. Revisa tu internet.';
      case 'AuthError':
        return appError?.payload?.message ?? 'Error en el servidor. Inténtalo más tarde.';
      case 'Unauthorized':
        return 'Sesión expirada o no autorizada.';
      case 'ServerError':
        return appError?.payload?.message ?? 'Error en el servidor. Inténtalo más tarde.';
      case 'Conflict':
        return appError.payload.message;
      case 'BadRequest':
        return 'La solicitud es inválida.';
      default:
        return 'Error desconocido en el sistema.';
    }
  }
}
