import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { UserRole as ROLES } from '@shared/enums/roles/roles.enum';
import { PageConfiguration } from 'src/app/page-configurations';
import beautyLottie from 'src/assets/lottie/beauty-salon-lottie.json';

interface MenuItem {
  label: string;
  route?: string; // Ahora es opcional si tiene hijos
  roles?: string[];
  iconPath: string;
  children?: MenuItem[]; // Soporte para submenús
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
  // Estados con Signals
  public isCollapsed = signal(false); // Desktop collapse
  public isMobileOpen = signal(false); // Mobile toggle
  public expandedMenu = signal<string | null>(null); // Tracking de submenú abierto

  public lottieOptions: AnimationOptions = {
    animationData: beautyLottie,
    loop: true,
    autoplay: true,
  };

  // 1. Definición centralizada del Menú
  public menuItems: MenuItem[] = [
    { label: 'Dashboard', route: this.ROUTES.nav.dashboard, iconPath: 'dashboard' },
    {
      label: 'Productos', // Ejemplo con Submenú
      iconPath: 'handbag',
      roles: [ROLES.ADMIN, ROLES.SALES],
      children: [
        { label: 'Lista de Productos', route: '/app/products', iconPath: 'list' },
        { label: 'Categorías', route: '/app/products/categories', iconPath: 'category' },
      ],
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
    // En desktop colapsa, en móvil abre/cierra el drawer
    if (window.innerWidth < 1024) {
      this.isMobileOpen.update((v) => !v);
    } else {
      this.isCollapsed.update((v) => !v);
    }
  }

  toggleSubmenu(label: string) {
    if (this.isCollapsed()) this.isCollapsed.set(false); // Expandir si estaba colapsado
    this.expandedMenu.update((current) => (current === label ? null : label));
  }

  profile() {
    if (this.hasRole(ROLES.CLIENT)) {
      return this.nav.push(this.ROUTES.nav.clients.view(this.authService.currentUser()!.clientId!));
    }
    return this.nav.push(this.ROUTES.nav.users.view(this.authService.currentUser()!.id));
  }
}
