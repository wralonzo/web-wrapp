import { RustService } from './core/rust/rust.service';
import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalHostComponent } from '@shared/components/custom-modal/modal-host.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ToastComponent } from '@shared/components/toast/toast.component';
import { PageConfiguration } from './page-configurations';
import { environment } from '@env/environment.development';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ModalHostComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  styles: [],
  providers: [],
})
export class App extends PageConfiguration implements OnInit {
  protected readonly title = signal('web-retail');

  constructor() {
    super();
  }

  async ngOnInit() {
    await this.initAuth();
  }

  public async initAuth() {
    try {
      // Accedemos directamente al getter
      // 1. ESPERAMOS el bridge (getAuth devuelve una promesa que se resuelve cuando Rust termina)
      const auth = this.rustSerive.auth;
      console.log('Error en flujo auth:', auth);
      // 2. Ahora sí es 100% seguro usarlo
      await auth.hydrate();
      const isLogged = await auth.iniSession();
      console.log('Error en flujo auth:', isLogged);

      if (!isLogged) {
        await auth.logout();
        return this.nav.setRoot(this.ROUTES.nav.login);
      }
      return this.nav.setRoot(this.ROUTES.nav.dashboard);
    } catch (error) {
      console.error('Error en flujo auth:', error);
      // Si el error persiste, redirigir a login por seguridad
      this.nav.setRoot(this.ROUTES.nav.login);
    }
  }
}
