import { Routes } from '@angular/router';

export const QUOTES_ROUTES: Routes = [
    {
        path: '',
        title: 'Cotizaciones',
        loadComponent: () => import('./list/list-quote.component').then(m => m.ListQuoteComponent)
    },
    {
        path: 'add',
        title: 'Nueva Cotización',
        loadComponent: () => import('./add/add-quote.component').then(m => m.AddQuoteComponent)
    },
    {
        path: 'edit/:id',
        title: 'Editar Cotización',
        loadComponent: () => import('./add/add-quote.component').then(m => m.AddQuoteComponent)
    }
];
