import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { UserRole as ROLES } from '@shared/enums/roles/roles.enum';
import { PageConfiguration } from 'src/app/page-configurations';
import beautyLottie from 'src/assets/lottie/beauty-salon-lottie.json';

interface MenuItem {
  label: string;
  route: string;
  roles?: string[]; // Si no se define, es público (dentro de la app)
  iconPath: string; // El atributo 'd' del SVG
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, BreadcrumbComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent extends PageConfiguration {
  public readonly ROLES = ROLES;
  public isCollapsed = signal(true);

  public lottieOptions: AnimationOptions = {
    animationData: beautyLottie,
    loop: true,
    autoplay: true,
  };

  // 1. Definición centralizada del Menú
  public menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: this.ROUTES.nav.dashboard,
      iconPath: 'dashboard',
    },
    {
      label: 'Clientes',
      route: this.ROUTES.nav.clients.list,
      roles: [ROLES.ADMIN, ROLES.SALES],
      iconPath: 'clients',
    },
    {
      label: 'Usuarios',
      route: this.ROUTES.nav.users.list,
      roles: [ROLES.ADMIN],
      iconPath: 'users',
    },
    {
      label: 'Reservaciones',
      route: '/app/reservations',
      roles: [ROLES.ADMIN, ROLES.SALES],
      iconPath: 'reservations',
    },
    {
      label: 'Productos',
      route: '/app/products',
      roles: [ROLES.ADMIN, ROLES.SALES],
      iconPath: 'handbag',
    },
  ];

  toggleSidebar() {
    this.isCollapsed.update((v) => !v);
  }

  profile() {
    if (this.hasRole(ROLES.CLIENT)) {
      return this.nav.push(this.ROUTES.nav.clients.view(this.authService.currentUser()!.clientId!));
    }
    return this.nav.push(this.ROUTES.nav.users.view(this.authService.currentUser()!.id!));
  }
}
