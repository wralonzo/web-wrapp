import { Routes } from '@angular/router';

export const PERMISSIONS_ROUTES: Routes = [
    {
        path: '',
        title: 'Lista de Permisos',
        loadComponent: () => import('./list/permissions-list.component').then(m => m.PermissionsListComponent)
    }
];
