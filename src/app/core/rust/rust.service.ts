import { Injectable, inject } from '@angular/core';
import init, {
  AuthBridge,
  initCoreConfig,
  GenericHttpBridge,
} from '@assets/retail-shop/rust_retail';
import { LoaderService } from '@core/services/loader.service';
import { environment } from '@env/environment.development.js';
import rustPaht from 'rust-retail/rust_retail_bg.wasm?url';

@Injectable({ providedIn: 'root' })
export class RustService {
  private http: GenericHttpBridge | null = null;
  private _auth: AuthBridge | null = null;
  loaderService = inject(LoaderService);
  async initConfig(): Promise<void> {
    try {
      await init(rustPaht); // Carga WASM

      initCoreConfig(environment.apiUrl);

      // Añadimos un pequeño delay de seguridad para que la memoria WASM se asiente
      // (A veces necesario en entornos de desarrollo muy rápidos)

      console.log('Instanciando puentes...');
      this._auth = new AuthBridge(); // <--- Aquí es donde ocurre el pánico ahora
      this.http = new GenericHttpBridge();
      console.log('Rust Ready');
    } catch (e) {
      // Si entra aquí, es porque initCoreConfig o el constructor de AuthBridge falló
      console.error('❌ Error en inicialización de Rust:', e);
      throw e;
    }
  }

  // Mantenemos el getter pero ahora es más informativo
  get auth(): AuthBridge {
    const value = this._auth;
    if (!value) throw new Error('AuthBridge no está listo. Usa getAuth() en su lugar.');
    return value;
  }

  get httpRust(): GenericHttpBridge {
    const value = this.http;
    if (!value) throw new Error('AuthBridge no está listo. Usa getAuth() en su lugar.');
    return value;
  }

  async call<T>(operation: (bridge: any) => Promise<T>): Promise<T> {
    const bridge = this.httpRust;
    this.loaderService.show();
    try {
      return await operation(bridge);
    } finally {
      this.loaderService.hide();
    }
  }
}
