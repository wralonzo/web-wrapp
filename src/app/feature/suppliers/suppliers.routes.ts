import { Routes } from '@angular/router';

export const SUPPLIERS_ROUTES: Routes = [
    {
        path: '',
        title: 'Lista de Proveedores',
        loadComponent: () => import('./list/suppliers-list.component').then(m => m.SuppliersListComponent)
    },
    {
        path: 'add',
        title: 'Nuevo Proveedor',
        loadComponent: () => import('./add/add-supplier.component').then(m => m.AddSupplierComponent)
    },
    {
        path: 'edit/:id',
        title: 'Editar Proveedor',
        loadComponent: () => import('./edit/edit-supplier.component').then(m => m.EditSupplierComponent)
    }
];
