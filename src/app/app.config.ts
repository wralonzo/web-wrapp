import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';

import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'; // 👈 Importaciones nuevas
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { loaderInterceptor } from '@core/interceptors/loader.interceptor';
import { RustDataService } from '@core/rust/rust-data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideLottieOptions({
      player: () => player,
    }),
    provideHttpClient(withInterceptors([errorInterceptor, loaderInterceptor])),
    provideCharts(withDefaultRegisterables()),
    // 2. Hidratar sesión (Token y Usuario desde SQLite)
    provideAppInitializer(() => {
      const rustData = inject(RustDataService);
      return rustData.initialize();
    }),
    provideRouter(routes, withHashLocation()),
  ],
};
