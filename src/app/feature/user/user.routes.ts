import { Routes } from '@angular/router';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { UserRole } from '@shared/enums/roles/roles.enum';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/list.component').then((m) => m.ListUserComponent),
    data: { rols: [UserRole.ADMIN] },
    title: 'Lista de Usuarios',
  },
  {
    path: APP_ROUTES.definitions.add,
    title: 'Nuevo Usuario',
    data: { rols: [UserRole.ADMIN] },
    loadComponent: () => import('./add/add.component').then((m) => m.AddUserComponent),
  },
  {
    path: APP_ROUTES.definitions.edit,
    title: 'Editar Usuario',
    loadComponent: () => import('./edit/edit.component').then((m) => m.EditUserComponponent),
  },
  {
    path: APP_ROUTES.definitions.view,
    title: 'Ver Usuario',
    data: { rols: [UserRole.ADMIN, UserRole.SALES, UserRole.CLIENT] },
    loadComponent: () => import('./view/view.component').then((m) => m.ViewUserComponent),
  },
  {
    path: APP_ROUTES.definitions.resetPassword,
    title: 'Resetear Password',
    loadComponent: () => import('./list/list.component').then((m) => m.ListUserComponent),
  },
];
