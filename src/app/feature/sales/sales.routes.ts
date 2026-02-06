import { Routes } from '@angular/router';

export const SALES_ROUTES: Routes = [
    {
        path: '',
        title: 'Ventas',
        loadComponent: () => import('./list/list-sale.component').then(m => m.ListSaleComponent)
    },
    {
        path: 'add',
        title: 'Nueva Venta',
        loadComponent: () => import('./add/add-sale.component').then(m => m.AddSaleComponent)
    },
    {
        path: 'edit/:id',
        title: 'Editar Venta',
        loadComponent: () => import('./add/add-sale.component').then(m => m.AddSaleComponent)
    }
];
