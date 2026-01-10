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

      // Módulo de Reservaciones
      {
        path: 'reservations',
        title: 'Reservaciones',
        loadChildren: () =>
          import('./feature/reservations/reservations.routes').then((m) => m.RESERVATIONS_ROUTES),
      },
      {
        path: 'reservations/calendar',
        component: ReservationCalendarComponent,
      },

      // Otras Rutas

      {
        path: 'suppliers',
        title: 'Proveedores',
        loadComponent: () => import('./feature/home/home').then((m) => m.HomeComponent),
      },

      // Default de la APP
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // 4. Comodín (Wildcard) - Siempre al final
  { path: '**', redirectTo: 'auth/login' },
];
