import {
  Component,
  inject,
  OnInit,
  signal,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GoogleService } from '@core/services/google.service';
declare var google: any;
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
  providers: [GoogleService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends PageConfiguration implements OnInit, AfterViewInit {
  public email: string = '';
  public password: string = 'n3z00N@beQ7(';
  public isLoading = signal(false);
  private googleService = inject(GoogleService);

  // 1. Creamos un signal para el mensaje de error
  public errorMessage = signal<string | null>(null);

  public options: AnimationOptions = {
    path: 'https://assets9.lottiefiles.com/packages/lf20_m9zragkd.json',
    loop: true,
    autoplay: true,
  };

  @ViewChild('googleBtnContainer') googleBtnContainer!: ElementRef;

  constructor() {
    super();
  }

  public ngOnInit(): void {
    this.authService.deleteSession();
    this.getGoogleClientId();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.googleBtnContainer) {
        google.accounts.id.renderButton(this.googleBtnContainer.nativeElement, {
          theme: 'filled_blue',
          size: 'large',
          shape: 'pill',
        });
      }
    }, 100);
  }

  public onLogin() {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.login({ username: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.nav.setRoot(this.ROUTES.nav.dashboard, { welcomeMessage: '¡Hola de nuevo!' });
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }

  handleLogin(response: any) {
    // El 'credential' es un ID Token de Google (JWT)
    const idToken = response.credential;

    this.authService.loginGoogle(idToken).subscribe({
      next: (res) => {
        this.nav.setRoot(this.ROUTES.nav.dashboard, { welcomeMessage: '¡Hola de nuevo!' });
      },
      error: (err) => {
        this.errorMessage.set('Error al iniciar sesión con Google. Intenta de nuevo.');
      },
    });
  }

  getGoogleClientId() {
    return this.googleService.getIdGoogleClient().subscribe({
      next: (response) => {
        const { clientId } = response.data.clientId;
        this.logger.log('Google Client ID:', clientId);
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => this.handleLogin(response),
        });

        google.accounts.id.renderButton(document.getElementById('google-btn'), {
          theme: 'filled_blue',
          size: 'large',
          shape: 'pill',
        });
      },
      error: (err) => {
        console.error('Error fetching Google Client ID:', err);
      },
    });
  }
}
