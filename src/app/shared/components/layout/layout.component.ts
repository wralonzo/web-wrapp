import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { UserRole as ROLES } from '@shared/enums/roles/roles.enum';
import { PageConfiguration } from 'src/app/page-configurations';
import beautyLottie from 'src/assets/lottie/beauty-salon-lottie.json';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

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
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, BreadcrumbComponent, ThemeToggleComponent],
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
      label: 'Clientes',
      route: this.ROUTES.nav.clients.list,
      roles: [ROLES.ADMIN, ROLES.SALES],
      iconPath: 'clients',
    },
    {
      label: 'Ventas',
      route: '/app/sales',
      roles: [ROLES.ADMIN, ROLES.SALES],
      iconPath: 'sales',
    },
    {
      label: 'Punto de Venta',
      route: '/app/pos',
      roles: [ROLES.ADMIN, ROLES.SALES],
      iconPath: 'handbag',
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
    {
      label: 'Combos / Kits',
      route: '/app/product-bundles',
      roles: [ROLES.ADMIN, ROLES.SALES],
      iconPath: 'orders',
    },
    {
      label: 'Inventario',
      route: '/app/inventory',
      roles: [ROLES.ADMIN, ROLES.SALES],
      iconPath: 'reports',
    },
    {
      label: 'Cotizaciones',
      route: '/app/quotes',
      roles: [ROLES.ADMIN, ROLES.SALES],
      iconPath: 'quotes', // Assuming 'receipt' icon exists, otherwise need to check or use a generic one
    },
    {
      label: 'Órdenes Trabajo',
      route: '/app/work-orders',
      roles: [ROLES.ADMIN, ROLES.SALES],
      iconPath: 'settings', // Generic icon
    },
    {
      label: 'Gastos',
      route: '/app/products',
      roles: [ROLES.ADMIN, ROLES.SALES],
      iconPath: 'expenses',
    },
    {
      label: 'Usuarios',
      route: this.ROUTES.nav.users.list,
      roles: [ROLES.ADMIN],
      iconPath: 'users',
    },
    {
      label: 'Compras',
      route: this.ROUTES.nav.users.list,
      roles: [ROLES.ADMIN],
      iconPath: 'purchases',
    },
    {
      label: 'Pedidos',
      route: this.ROUTES.nav.users.list,
      roles: [ROLES.ADMIN],
      iconPath: 'orders',
    },
    {
      label: 'Reportes',
      route: this.ROUTES.nav.users.list,
      roles: [ROLES.ADMIN],
      iconPath: 'reports',
      children: [
        { label: 'Reporte de Ventas', route: this.ROUTES.nav.users.list, iconPath: 'sales' },
        { label: 'Reporte de Gastos', route: this.ROUTES.nav.users.list, iconPath: 'expenses' },
        { label: 'Reporte de Compras', route: this.ROUTES.nav.users.list, iconPath: 'purchases' },
        { label: 'Reporte de Pedidos', route: this.ROUTES.nav.users.list, iconPath: 'orders' },
        { label: 'Reporte de Reservaciones', route: this.ROUTES.nav.users.list, iconPath: 'reservations' },
      ],
    },
    {
      label: 'Configuraciones', // Ejemplo con Submenú
      iconPath: 'config',
      roles: [ROLES.ADMIN, ROLES.SALES],
      children: [
        { label: 'Unidades de Producto', route: '/app/product-units', iconPath: 'handbag' },
        { label: 'Roles', route: this.ROUTES.nav.roles.list, iconPath: 'users' },
        { label: 'Categorías', route: this.ROUTES.nav.categories.list, iconPath: 'handbag' },
        { label: 'Proveedores', route: this.ROUTES.nav.suppliers.list, iconPath: 'clients' },
        { label: 'Permisos', route: this.ROUTES.nav.permissions.list, iconPath: 'config' },
        { label: 'Sucursales', route: this.ROUTES.nav.branches.list, iconPath: 'config' },
        { label: 'Almacenes', route: this.ROUTES.nav.warehouses.list, iconPath: 'handbag' },
        { label: 'Puestos de trabajo', route: this.ROUTES.nav.positions.list, iconPath: 'profile' },
      ],
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
      return this.nav.push(this.ROUTES.nav.clients.view(this.authService.currentUser()!.user.id));
    }
    return this.nav.push(this.ROUTES.nav.users.view(this.authService.currentUser()!.user.id));
  }
}
