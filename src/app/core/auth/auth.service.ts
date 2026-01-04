import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthResponse, User } from '../../shared/models/user/user.model';
import { environment } from '../../../environments/environment.development';
import { LoggerService } from '../services/logger.service';
import { APP_ROUTES } from '@core/constants/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private logger = inject(LoggerService);

  private readonly API_URL = environment.apiUrl;

  // Clave única para el localStorage
  private readonly STORAGE_KEY = 'user_data';

  // 1. Fuente de verdad privada
  private userSignal = signal<User | null>(this.getUserFromStorage());

  // 2. Exponemos el estado de forma pública y reactiva (Solo lectura)
  public currentUser = computed(() => this.userSignal());
  public isAuthenticated = computed(() => !!this.userSignal());

  login(credentials: { username: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API_URL}auth/login`, credentials).pipe(
      tap((response) => {
        if (response.success && response.data) {
          // Si el login es correcto, actualizamos el estado global automáticamente
          this.setCurrentUser(response.data);
          this.logger.info('User logged in', response.data);
        }
      })
    );
  }

  loginGoogle(idToken: string) {
    return this.http.post<AuthResponse>(`${this.API_URL}auth/google`, { idToken }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          // Si el login es correcto, actualizamos el estado global automáticamente
          this.setCurrentUser(response.data);
          this.logger.info('User logged in with Google', response.data);
        }
      })
    );
  }

  public setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }

  public logout(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.userSignal.set(null);
      this.router.navigate([`${APP_ROUTES.nav.login}`]);
    } catch (error) {
      this.logger.error('Error during logout', error);
    }
  }

  public deleteSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.userSignal.set(null);
  }

  private getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      try {
        return JSON.parse(storedUser) as User;
      } catch (e) {
        this.logger.error('Error al parsear el usuario del storage', e);
        return null;
      }
    }
    return null;
  }
}
