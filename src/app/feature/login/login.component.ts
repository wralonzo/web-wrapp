import {
  Component,
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
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends PageConfiguration implements OnInit, AfterViewInit {
  public email: string = 'smisssth_staff';
  public password: string = 'TestG9090?';
  public isLoading = signal(false);

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
    // We will initialize Google Button after view init to ensure container exists,
    // or we can just wait for the async call to finish.
    // Ideally, we move the logic to ngAfterViewInit or handle it carefully.
  }

  public async ngAfterViewInit(): Promise<void> {
    try {
      const config = this.rustService.auth.getConfig();
      console.log('🔍 DEBUG: Current Rust Config BaseURL:', config);
      this.logger.info('Rust Config', config);
    } catch (e) {
      console.error('Failed to get rust config', e);
    }
    this.getGoogleClientId();
  }

  public async onLogin() {
    try {
      if (this.isLoading()) return;
      this.isLoading.set(true);
      const response = await this.authService.login(this.email, this.password);
      this.logger.info('Login', response);
      this.isLoading.set(false);
      this.toast.show('Authenticación exitosa', 'success');
      const dataLocal = await this.rustService.auth.getUserLocal();
      this.logger.info('dataLocal', dataLocal);
      return this.nav.setRoot(this.ROUTES.nav.dashboard);
    } catch (error) {
      this.isLoading.set(false);
      this.provideError(error);
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
      this.provideError(error);
    }
  }

  async getGoogleClientId() {
    try {
      const { clientId } = await this.rustService.auth.getIdGoogleClient();
      this.logger.log('Google Client ID:', clientId);

      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => this.handleLogin(response),
      });

      if (this.googleBtnContainer) {
        google.accounts.id.renderButton(this.googleBtnContainer.nativeElement, {
          theme: 'filled_blue',
          size: 'large',
          shape: 'pill',
        });
      }
    } catch (error: any) {
      this.provideError(error);
    }
  }
}
