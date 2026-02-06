import { Routes } from '@angular/router';

export const PRODUCT_UNITS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./list/list-product-unit.component').then(m => m.ListProductUnitComponent)
    },
    {
        path: 'add',
        loadComponent: () => import('./add/add-product-unit.component').then(m => m.AddProductUnitComponent)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./add/add-product-unit.component').then(m => m.AddProductUnitComponent)
    }
];
