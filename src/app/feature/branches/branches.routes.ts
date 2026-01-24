import { Routes } from '@angular/router';

export const BRANCHES_ROUTES: Routes = [
    {
        path: '',
        title: 'Lista de Sucursales',
        loadComponent: () => import('./list/branches-list.component').then(m => m.BranchesListComponent)
    }
];
