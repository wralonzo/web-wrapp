import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ModalHostComponent } from '@shared/components/custom-modal/modal-host.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ToastComponent } from '@shared/components/toast/toast.component';
import { PageConfiguration } from './page-configurations';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ModalHostComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  styles: [],
  providers: [],
})
export class App extends PageConfiguration implements OnInit {
  private router = inject(Router);
  private location = inject(Location);

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
      const auth = this.rustService.auth;
      // 2. Ahora sí es 100% seguro usarlo
      await auth.hydrate();
      const isLogged = await auth.iniSession();
      this.logger.log('Estado de sesion:', isLogged);

      if (!isLogged) {
        await auth.logout();
        return this.nav.setRoot(this.ROUTES.nav.login);
      }
      // location.path() obtiene la ruta real del navegador aunque el router no haya iniciado
      const currentPath = this.location.path();
      this.logger.info("Ruta detectada en el navegador:", currentPath);

      // Solo redirigimos al dashboard si estamos realmente en la raíz o en login
      if (currentPath === '' || currentPath === '/' || currentPath === '/login') {
        return this.nav.setRoot(this.ROUTES.nav.dashboard);
      }
    } catch (error) {
      this.logger.error('Error en flujo auth:', error);
      // Si el error persiste, redirigir a login por seguridad
      this.nav.setRoot(this.ROUTES.nav.login);
    }
  }
}
