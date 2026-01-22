import { HttpParams } from '@angular/common/http';
import { inject, Directive, OnInit } from '@angular/core';
import { ApiErrorPayload } from '@assets/retail-shop/ApiErrorPayload';
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
  protected readonly nav = inject(NavigationService);
  protected readonly authService = inject(AuthService);
  protected readonly logger = inject(LoggerService);
  protected readonly toast = inject(ToastService);
  protected readonly rustService = inject(RustService);

  // Acceso fácil al diccionario de rutas
  protected readonly ROUTES = APP_ROUTES;

  // Lógica común, por ejemplo, verificar si el usuario tiene permiso
  /**
   * Verifica si el usuario actual tiene uno o varios roles.
   * @param requiredRoles Puede ser un string único 'admin' o un array ['admin', 'vendor']
   */
  public hasRole(requiredRoles: string | string[]): boolean {
    const userRoles = this.authService.currentUser()?.user.roles;

    // Si no hay usuario o no tiene roles, denegar
    if (!userRoles) return false;

    // Si recibimos un string, lo convertimos en array para procesarlo igual
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    // Retorna true si AL MENOS UNO de los roles del usuario coincide con los requeridos
    return userRoles.some((role) => rolesArray.includes(role));
  }

  public objectToStringQuery(params: {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  }): string {
    return new HttpParams({ fromObject: params }).toString();
  }
  public provideError(error: any): void {
    // Validar que sea un objeto AppError generado por Rust
    if (!error || typeof error !== 'object' || !('type' in error)) {
      this.toast.show('Error inesperado en la aplicación.', 'error');
      return;
    }

    const appError = error as AppError;
    this.logger.error(`[${appError.type}] Error detectado:`, appError);

    // Mapeo exhaustivo según el enum de Rust
    switch (appError.type) {
      case 'ApiError':
        this.handleApiError(appError.payload);
        break;

      case 'Unauthorized':
        this.toast.show('Credenciales no válidas.', 'error');
        this.authService.logout(); // Limpia storage local y memoria
        this.nav.push(this.ROUTES.nav.login);
        break;

      case 'NetworkError':
        this.toast.show('No se pudo conectar con el servidor. Revise su conexión.', 'error');
        break;

      case 'DatabaseError':
        this.toast.show(`Error de almacenamiento: ${appError.payload.message}`, 'error');
        break;

      case 'AuthError':
        this.toast.show('Usuario con error en authenticación', 'error');
        break;

      case 'ServerError':
        this.toast.show('Internal server error', 'error');
        break;

      case 'Conflict':
        this.toast.show('Conflicto con el recurso', 'error');
        break;

      case 'NotFoundError':
        this.toast.show('Rescurso no encontrado', 'error');
        break;

      case 'PaymentRequired':
        this.toast.show('Pago requerido', 'error');
        break;

      case 'ParseError':
        this.toast.show(appError.payload.message, 'error');
        break;

      case 'EmptyField':
        this.toast.show(`El campo ${appError.payload.message} es obligatorio.`, 'error');
        break;

      case 'BadRequest':
        this.toast.show('La solicitud es inválida. Verifique los datos.', 'error');
        break;

      case 'EmailInvalid':
        this.toast.show('El formato del correo electrónico no es válido.', 'error');
        break;

      case 'Unknown':
      default:
        this.toast.show('Ocurrió un error desconocido. Contacte a soporte.', 'error');
        break;
    }
  }

  private handleApiError(payload: ApiErrorPayload): void {
    const { code, message, error_api } = payload;

    // Log detallado del error crudo del backend para debugging
    this.logger.error('Backend Raw Error:', error_api);

    switch (code) {
      case 401:
        this.toast.show(message || 'No autorizado. Sesión finalizada.', 'error');
        this.authService.logout();
        this.nav.push(this.ROUTES.nav.login);
        break;
      case 403:
        this.toast.show(message || 'Acceso denegado.', 'error');
        break;
      case 404:
        this.toast.show(message || 'El recurso solicitado no existe.', 'error');
        break;
      case 409:
        this.toast.show(message || 'Conflicto: El registro ya existe.', 'error');
        break;
      case 500:
        this.toast.show(message || 'Error interno del servidor. Intente más tarde.', 'error');
        break;
      default:
        this.toast.show(message || 'Error en la comunicación con el API.', 'error');
        break;
    }
  }
}
