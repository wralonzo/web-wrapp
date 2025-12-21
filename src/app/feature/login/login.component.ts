import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { AuthService } from '../../core/auth/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LottieComponent,
    ButtonComponent,
    FormsModule,
    InputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public email: string = '';
  public password: string = '';
  public isLoading = signal(false);

  // 1. Creamos un signal para el mensaje de error
  public errorMessage = signal<string | null>(null);

  public options: AnimationOptions = {
    path: 'https://assets9.lottiefiles.com/packages/lf20_m9zragkd.json',
    loop: true,
    autoplay: true,
  };

  onLogin() {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.login({ username: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        // El guardado del usuario ya ocurre en el 'tap' del servicio
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);

        // 2. Lógica para identificar el error
        if (err.status === 401) {
          this.errorMessage.set(err.error.message || 'Credenciales inválidas. Intenta de nuevo.');
        } else if (err.status === 0) {
          this.errorMessage.set('No se pudo conectar con el servidor. Revisa tu conexión.');
        } else {
          // Intentamos obtener el mensaje que envía tu HttpResponseApi desde el backend
          const backendMessage = err.error?.message || 'Ocurrió un error inesperado.';
          this.errorMessage.set(backendMessage);
        }
      },
    });
  }
}
