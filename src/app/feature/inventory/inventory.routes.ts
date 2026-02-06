import { Routes } from '@angular/router';

export const INVENTORY_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./list/reference-inventory.component').then(m => m.ReferenceInventoryComponent)
    }
];
