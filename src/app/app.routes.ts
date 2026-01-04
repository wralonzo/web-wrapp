import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { UserRole } from '@shared/enums/roles/roles.enum';

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

      // Módulo de Reservaciones
      {
        path: 'reservations',
        data: {
          rols: [UserRole.ADMIN, UserRole.SALES],
        },
        title: 'Reservaciones',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./feature/reservations/list/list-reservation.component').then(
                (m) => m.ListReservationComponent
              ),
          },
          {
            path: 'add',
            title: 'Nueva Reservación',
            loadComponent: () =>
              import('./feature/reservations/add/add-reservation.component').then(
                (m) => m.AddReservationComponent
              ),
          },
          {
            path: 'edit/:id',
            title: 'Editar Reservación',
            loadComponent: () =>
              import('./feature/reservations/add/add-reservation.component').then(
                (m) => m.AddReservationComponent
              ),
          },
          {
            path: 'view/:id',
            title: 'Ver Reservación',
            loadComponent: () =>
              import('./feature/reservations/add/add-reservation.component').then(
                (m) => m.AddReservationComponent
              ),
          },
        ],
      },

      // Otras Rutas
      {
        path: 'products',
        title: 'Productos',
        loadComponent: () => import('./feature/home/home').then((m) => m.HomeComponent),
      },
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
