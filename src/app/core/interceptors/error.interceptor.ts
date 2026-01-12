import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { RustDataService } from '@core/rust/rust-data.service';
import { filter, switchMap } from 'rxjs';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const rustData = inject(RustDataService);

  return rustData.initialized$.pipe(
    filter(ready => ready), // No deja pasar la petición hasta que Rust esté listo
    switchMap(() => next(req))
  );
};
