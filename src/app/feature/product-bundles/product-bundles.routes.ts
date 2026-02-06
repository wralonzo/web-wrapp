import { Routes } from '@angular/router';

export const PRODUCT_BUNDLES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./list/list-product-bundle.component').then(m => m.ListProductBundleComponent)
    },
    {
        path: 'add',
        loadComponent: () => import('./add/add-product-bundle.component').then(m => m.AddProductBundleComponent)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./add/add-product-bundle.component').then(m => m.AddProductBundleComponent)
    }
];
