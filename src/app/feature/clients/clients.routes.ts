import { Routes } from '@angular/router';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { UserRole } from '@shared/enums/roles/roles.enum';

export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Directorio de Clientes',
    data: {
      rols: [UserRole.ADMIN, UserRole.SALES],
    },
    loadComponent: () => import('./clients.component').then((m) => m.ClientsComponent),
  },
  {
    path: APP_ROUTES.definitions.add,
    title: 'Nuevo Cliente',
    data: {
      rols: [UserRole.ADMIN, UserRole.SALES],
    },
    loadComponent: () =>
      import('./add-client/add-client.component').then((m) => m.AddClientComponent),
  },
  {
    path: APP_ROUTES.definitions.edit,
    title: 'Editar Cliente',
    loadComponent: () =>
      import('./edit-client/edit-client.component').then((m) => m.EditClientComponent),
  },
  {
    path: APP_ROUTES.definitions.view,
    title: 'Detalle de Cliente',
    loadComponent: () =>
      import('./client-detail/client-detail.component').then((m) => m.ClientDetailComponent),
  },
];
