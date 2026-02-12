import { Routes } from '@angular/router';

export const INVENTORY_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./list/reference-inventory.component').then(m => m.ReferenceInventoryComponent)
    },
    {
        path: 'add',
        loadComponent: () => import('./add/add-inventory.component').then(m => m.AddInventoryComponent)
    }
];
