import { Routes } from '@angular/router';

export const WORK_ORDERS_ROUTES: Routes = [
    {
        path: '',
        title: 'Órdenes de Trabajo',
        loadComponent: () => import('./list/list-work-order.component').then(m => m.ListWorkOrderComponent)
    },
    {
        path: 'add',
        title: 'Nueva Orden',
        loadComponent: () => import('./add/add-work-order.component').then(m => m.AddWorkOrderComponent)
    },
    {
        path: 'edit/:id',
        title: 'Editar Orden',
        loadComponent: () => import('./add/add-work-order.component').then(m => m.AddWorkOrderComponent)
    }
];
