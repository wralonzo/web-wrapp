import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { RustService } from '@core/rust/rust.service';
import { User } from '@assets/retail-shop/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private logger = inject(LoggerService);
  private readonly rustBridge = inject(RustService);

  // 1. Fuente de verdad privada
  private userSignal = signal<User | null>(null);

  // 2. Exponemos el estado de forma pública y reactiva (Solo lectura)
  public currentUser = computed(() => this.userSignal());
  public isAuthenticated = computed(() => !!this.userSignal());

  constructor() {
    // 3. Disparamos la carga asíncrona inmediatamente
    this.initializeSession();
  }

  async login(user: string, password: string): Promise<User> {
    const auth = this.rustBridge.auth;
    return new Promise<User>((resolve, reject) => {
      auth
        .login(user, password)
        .then((response) => {
          resolve(response);
        })
        .catch((e) => reject(e));
    });
  }

  async loginGoogle(idToken: string): Promise<User> {
    const auth = this.rustBridge.auth;

    return new Promise<any>((resolve, reject) => {
      auth
        .loginGoogle(idToken)
        .then((response) => {
          resolve(response);
        })
        .catch((e) => reject(e));
    });
  }

  public async logout() {
    try {
      const auth = this.rustBridge.auth;
      await auth.logout();
      this.router.navigate([`${APP_ROUTES.nav.login}`]);
    } catch (error) {
      this.logger.error('Error during logout', error);
    }
  }

  public deleteSession(): void {
    this.userSignal.set(null);
  }

  private async initializeSession(): Promise<void> {
    try {
      // IMPORTANTE: Primero hidratamos el HttpClient de Rust con el token
      await this.rustBridge.auth.hydrate();

      // Luego recuperamos los datos del usuario para la UI
      const storedUser = await this.rustBridge.auth.getUserLocal();

      console.info('✅ Sesión recuperada de Rust:', storedUser);
      this.userSignal.set(storedUser);
    } catch (e) {
      console.error('❌ Error al recuperar la sesión de Rust:', e);
      this.userSignal.set(null);
    }
  }
}
