import { Routes } from '@angular/router';

export const WAREHOUSES_ROUTES: Routes = [
    {
        path: '',
        title: 'Lista de Almacenes',
        loadComponent: () => import('./list/warehouses-list.component').then(m => m.WarehousesListComponent)
    },
    {
        path: 'add',
        title: 'Agregar Almacén',
        loadComponent: () => import('./add/add-warehouse.component').then(m => m.AddWarehouseComponent)
    },
    {
        path: 'edit/:id',
        title: 'Editar Almacén',
        loadComponent: () => import('./edit/edit-warehouse.component').then(m => m.EditWarehouseComponent)
    }
];
