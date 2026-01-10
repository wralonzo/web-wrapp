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
import { RustService } from '@core/rust/rust.service';
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
  private readonly rust = inject(RustService);

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

  public async ngOnInit(): Promise<void> {
    this.getGoogleClientId();
  }

  public async ngAfterViewInit(): Promise<void> {
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

  public async onLogin() {
    try {
      if (this.isLoading()) return;
      this.isLoading.set(true);
      const response = await this.authService.login(this.email, this.password);
      this.logger.info('Login', response);
      this.isLoading.set(false);
      this.toast.show('Authenticación exitosa', 'success');
      await this.nav.push(this.ROUTES.nav.dashboard, { welcomeMessage: '¡Hola de nuevo!' });
    } catch (error: any) {
      this.isLoading.set(false);
      this.logger.error('Error en Login', error);

      // Manejo seguro del mensaje de error que viene de Rust/Java
      const msg = error?.payload?.message || 'Error de conexión con el servidor';
      this.toast.show(msg, 'error');
    }
  }

  async handleLogin(response: any) {
    try {
      const idToken = response.credential;
      const loginUser = await this.authService.loginGoogle(idToken);
      this.logger.info('Login', loginUser);
      this.nav.setRoot(this.ROUTES.nav.dashboard, { welcomeMessage: '¡Hola de nuevo!' });
      this.toast.show('Authenticación exitosa', 'success');
    } catch (error: any) {
      this.toast.show(error.toString(), 'error');
    }
  }

  async getGoogleClientId() {
    try {
      const { clientId } = await this.rust.auth.getIdGoogleClient();
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
    } catch (error: any) {
      this.toast.show(error?.payload?.message ?? 'Sin conexión con el servidro', 'error');
      console.error('Error fetching Google Client ID:', error);
    }
  }
}
