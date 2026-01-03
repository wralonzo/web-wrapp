import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Inject siempre fuera de cualquier bloque
  const user = authService.currentUser();
  const token = user?.token;

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-App-Origin': 'TopFashion-Angular-App',
      },
    });
  } else {
    authReq = req.clone({
      setHeaders: {
        'X-App-Origin': 'TopFashion-Angular-App',
      },
    });
  }

  // Pasamos la petición al siguiente interceptor (errorInterceptor)
  return next(authReq);
};
