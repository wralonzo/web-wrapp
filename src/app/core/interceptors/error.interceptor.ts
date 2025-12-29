import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '@core/services/toast.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente (red, etc.)
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor (HTTP Status)
        switch (error.status) {
          case 400:
            errorMessage = error.error?.data?.message || 'La información enviada es incorrecta.';
            break;
          case 404:
            errorMessage = error.error?.message || 'El recurso solicitado no existe.';
            break;
          case 409:
            errorMessage = error.error?.message || 'Este registro ya existe (Conflicto).';
            break;
          case 500:
            errorMessage =
              error.error?.message || 'Error interno del servidor. Inténtalo más tarde.';
            break;
          default:
            errorMessage = error.error?.message || 'Error desconocido';
            break;
        }
      }

      // Mostramos el Toast una sola vez aquí para TODA la app
      toastService.show(errorMessage, 'error');

      // Devolvemos el error por si el componente aún necesita hacer algo
      return throwError(() => error);
    })
  );
};
