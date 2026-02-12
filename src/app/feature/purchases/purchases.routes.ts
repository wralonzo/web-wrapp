import { Routes } from '@angular/router';

export const PURCHASE_ROUTES: Routes = [
    {
        path: 'add',
        loadComponent: () => import('./add/add-purchase.component').then(m => m.AddPurchaseComponent)
    }
];
