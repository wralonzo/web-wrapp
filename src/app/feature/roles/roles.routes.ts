import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
    {
        path: '',
        title: 'Lista de Roles',
        loadComponent: () => import('./list/roles-list.component').then(m => m.RolesListComponent)
    },
    {
        path: 'add',
        title: 'Agregar Rol',
        loadComponent: () => import('./add/add-role.component').then(m => m.AddRoleComponent)
    },
    {
        path: 'edit/:id',
        title: 'Editar Rol',
        loadComponent: () => import('./edit/edit-role.component').then(m => m.EditRoleComponent)
    }
];
