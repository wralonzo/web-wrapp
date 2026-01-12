// rust-data.service.ts
import { Injectable, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { RustService } from './rust.service';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { User } from '@assets/retail-shop/User';

@Injectable({ providedIn: 'root' })
export class RustDataService {
  private bridge = inject(RustService);
  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  private isInitialized$ = new BehaviorSubject<boolean>(false);
  initialized$ = this.isInitialized$.asObservable();
  isInitialized = signal(false); // Signal para lectura rápida

  public async initialize(): Promise<void> {
    try {
      // 1. Esperamos al Bridge (WASM/SQLite)
      await this.bridge.initConfig();
      // 1. Rust recupera el token de SQLite e inyecta en HttpClient (Rust)
      await this.bridge.auth.hydrate();

      // 2. Intentamos recuperar los datos del usuario para Angular
      const user = await this.bridge.auth.getUserLocal();
      if (user) {
        this.currentUser.set(user);
      }
    } catch (e) {
      console.error('Error inicializando sesión desde Rust:', e);
    } finally {
      // 3. Notificamos que el proceso terminó (éxito o fallo)
      this.isInitialized$.next(true);
      this.isInitialized.set(true);
    }
  }
  // Wrapper para peticiones que ya incluye el manejo de errores global
  request<T>(method: 'get' | 'post', url: string, body?: any): Observable<T> {
    return from(
      this.bridge.call(async (bridge: GenericHttpBridge) => {
        if (method === 'get') return await bridge.get(url);
        return await bridge.post(url, body);
      })
    ).pipe(
      shareReplay(1),
      catchError((err) => this.handleGlobalError(err))
    );
  }

  private handleGlobalError(err: any) {
    if (err === 'Unauthorized') {
      this.currentUser.set(null);
      // Redirigir al login si es necesario
    }
    return throwError(() => err);
  }
}
