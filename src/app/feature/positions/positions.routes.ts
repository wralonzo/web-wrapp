import { Routes } from '@angular/router';

export const POSITIONS_ROUTES: Routes = [
    {
        path: '',
        title: 'Lista de Puestos de Trabajo',
        loadComponent: () => import('./list/positions-list.component').then(m => m.PositionsListComponent)
    },
    {
        path: 'add',
        title: 'Nuevo Puesto de Trabajo',
        loadComponent: () => import('./add/add-position.component').then(m => m.AddPositionComponent)
    },
    {
        path: 'edit/:id',
        title: 'Editar Puesto de Trabajo',
        loadComponent: () => import('./edit/edit-position.component').then(m => m.EditPositionComponent)
    }
];
