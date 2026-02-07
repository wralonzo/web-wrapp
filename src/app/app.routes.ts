import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { UserRole } from '@shared/enums/roles/roles.enum';
import { ReservationCalendarComponent } from '@shared/components/calendar/calendar.component';

export const routes: Routes = [
  // 1. Redirección inicial
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  // 2. Rutas de Autenticación (Lazy Loaded)
  {
    path: APP_ROUTES.definitions.auth,
    title: 'Autenticación',
    children: [
      {
        path: APP_ROUTES.definitions.login,
        title: 'Iniciar Sesión',
        loadComponent: () =>
          import('./feature/login/login.component').then((m) => m.LoginComponent),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  // 3. Rutas Privadas de la Aplicación (Lazy Loaded & Guarded)
  {
    path: APP_ROUTES.definitions.app,
    title: 'Inicio',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: APP_ROUTES.definitions.dashboard,
        title: 'Dashboard',
        loadComponent: () =>
          import('./shared/components/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },

      // Módulo de Clientes
      // ✅ RUTAS AUTOMATIZADAS POR MÓDULO
      {
        path: APP_ROUTES.definitions.clients,
        title: 'Clientes',
        loadChildren: () =>
          import('./feature/clients/clients.routes').then((m) => m.CLIENTS_ROUTES),
      },
      {
        path: APP_ROUTES.definitions.users,
        title: 'Usuarios',
        loadChildren: () => import('./feature/user/user.routes').then((m) => m.USER_ROUTES),
      },

      {
        path: 'products',
        title: 'Productos',
        loadChildren: () =>
          import('./feature/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
      },
      {
        path: 'product-units',
        title: 'Unidades de Producto',
        loadChildren: () =>
          import('./feature/product-units/product-units.routes').then((m) => m.PRODUCT_UNITS_ROUTES),
      },
      {
        path: 'product-bundles',
        title: 'Combos / Kits',
        loadChildren: () =>
          import('./feature/product-bundles/product-bundles.routes').then((m) => m.PRODUCT_BUNDLES_ROUTES),
      },
      {
        path: 'inventory',
        title: 'Inventario',
        loadChildren: () =>
          import('./feature/inventory/inventory.routes').then((m) => m.INVENTORY_ROUTES),
      },
      {
        path: 'quotes',
        title: 'Cotizaciones',
        loadChildren: () =>
          import('./feature/quotes/quotes.routes').then((m) => m.QUOTES_ROUTES),
      },
      {
        path: 'work-orders',
        title: 'Órdenes de Trabajo',
        loadChildren: () =>
          import('./feature/work-orders/work-orders.routes').then((m) => m.WORK_ORDERS_ROUTES),
      },
      {
        path: 'sales',
        title: 'Ventas',
        loadChildren: () =>
          import('./feature/sales/sales.routes').then((m) => m.SALES_ROUTES),
      },
      {
        path: 'pos',
        title: 'Punto de Venta',
        loadChildren: () =>
          import('./feature/pos/pos.routes').then((m) => m.POS_ROUTES),
      },

      {
        path: 'reservations',
        title: 'Reservaciones',
        loadChildren: () =>
          import('./feature/reservations/reservations.routes').then((m) => m.RESERVATIONS_ROUTES),
      },
      {
        path: APP_ROUTES.definitions.roles,
        title: 'Roles',
        loadChildren: () => import('./feature/roles/roles.routes').then((m) => m.ROLES_ROUTES),
      },
      {
        path: APP_ROUTES.definitions.branches,
        title: 'Sucursales',
        loadChildren: () =>
          import('./feature/branches/branches.routes').then((m) => m.BRANCHES_ROUTES),
      },
      {
        path: APP_ROUTES.definitions.warehouses,
        title: 'Almacenes',
        loadChildren: () =>
          import('./feature/warehouses/warehouses.routes').then((m) => m.WAREHOUSES_ROUTES),
      },
      {
        path: APP_ROUTES.definitions.positionTypes,
        title: 'Tipos de Posición',
        loadChildren: () =>
          import('./feature/positions/positions.routes').then((m) => m.POSITIONS_ROUTES),
      },
      {
        path: APP_ROUTES.definitions.permissions,
        title: 'Permisos',
        loadChildren: () =>
          import('./feature/permissions/permissions.routes').then((m) => m.PERMISSIONS_ROUTES),
      },
      {
        path: APP_ROUTES.definitions.categories,
        title: 'Permisos',
        loadChildren: () =>
          import('./feature/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES),
      },
      {
        path: 'reservations/calendar',
        component: ReservationCalendarComponent,
      },

      // Otras Rutas

      {
        path: 'suppliers',
        title: 'Proveedores',
        loadChildren: () =>
          import('./feature/suppliers/suppliers.routes').then((m) => m.SUPPLIERS_ROUTES),
      },

      // Default de la APP
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // 4. Comodín (Wildcard) - Siempre al final
  { path: '**', redirectTo: 'auth/login' },
];
