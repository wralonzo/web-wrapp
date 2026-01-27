import { Routes } from '@angular/router';

export const BRANCHES_ROUTES: Routes = [
    {
        path: '',
        title: 'Lista de Sucursales',
        loadComponent: () => import('./list/branches-list.component').then(m => m.BranchesListComponent)
    },
    {
        path: 'add',
        title: 'Nueva Sucursal',
        loadComponent: () => import('./add/add-branch.component').then(m => m.AddBranchComponent)
    },
    {
        path: 'edit/:id',
        title: 'Editar Sucursal',
        loadComponent: () => import('./edit/edit-branch.component').then(m => m.EditBranchComponent)
    }
];
