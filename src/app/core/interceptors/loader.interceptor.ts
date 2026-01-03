import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '@core/services/loader.service';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Mostramos el loader al iniciar la petición
  loaderService.show();

  return next(req).pipe(
    // Cuando la petición termine (éxito o error), ocultamos el loader
    finalize(() => loaderService.hide())
  );
};
