import { Routes } from '@angular/router';

export const PERMISSIONS_ROUTES: Routes = [
    {
        path: '',
        title: 'Lista de Permisos',
        loadComponent: () => import('./list/permissions-list.component').then(m => m.PermissionsListComponent)
    },
    {
        path: 'add',
        title: 'Nuevo Permiso',
        loadComponent: () => import('./add/add-permission.component').then(m => m.AddPermissionComponent)
    },
    {
        path: 'edit/:id',
        title: 'Editar Permiso',
        loadComponent: () => import('./edit/edit-permission.component').then(m => m.EditPermissionComponent)
    }
];
