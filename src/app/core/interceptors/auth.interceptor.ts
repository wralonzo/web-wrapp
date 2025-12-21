import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LoggerService } from '../services/logger.service'; // Opcional: usando tu nuevo logger

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  let headers: { [header: string]: string } = {
    'X-App-Origin': 'TopFashion-Angular-App',
  };
  try {
    const authService = inject(AuthService);

    // 1. Obtenemos el usuario del Signal (que ya maneja la carga desde localStorage)
    const user = authService.currentUser();
    const token = user?.token;

    // 2. Definimos los headers base

    // 3. Agregamos el token solo si existe en el estado global
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 4. Clonamos la petición
    const authReq = req.clone({ setHeaders: headers });

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejo centralizado de errores de autenticación
        if (error.status === 401) {
          logger.error('Sesión expirada o no autorizada. Redirigiendo al login...');
          authService.logout();
        }

        return throwError(() => error);
      })
    );
  } catch (error) {
    const authReq = req.clone({ setHeaders: headers });
    logger.error('Error en el interceptor de autenticación', error);
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
};
