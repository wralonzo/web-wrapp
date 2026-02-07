import { Routes } from '@angular/router';

export const POS_ROUTES: Routes = [
    {
        path: '',
        title: 'Punto de Venta',
        loadComponent: () => import('./pos.component').then(m => m.PosComponent)
    }
];
