import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'; // 👈 Importaciones nuevas
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { loaderInterceptor } from '@core/interceptors/loader.interceptor';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { RustService } from '@core/rust/rust.service';
import { RustDataService } from '@core/rust/rust-data.service';

export function initializeRust(rustService: RustService) {
  // Aquí es donde pasas la URL real de tu API
  return () => rustService.initConfig();
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideLottieOptions({
      player: () => player,
    }),
    provideHttpClient(withInterceptors([errorInterceptor, loaderInterceptor])),
    provideCharts(withDefaultRegisterables()),
    // 1. Inicializar configuración básica de Rust
    provideAppInitializer(() => {
      const rustService = inject(RustService);
      return rustService.initConfig();
    }),

    // 2. Hidratar sesión (Token y Usuario desde SQLite)
    provideAppInitializer(() => {
      const rustData = inject(RustDataService);
      return rustData.initialize();
    }),
  ],
};
