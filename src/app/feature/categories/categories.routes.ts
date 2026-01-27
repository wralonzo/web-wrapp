import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
    {
        path: '',
        title: 'Lista de Categorías',
        loadComponent: () => import('./list/categories-list.component').then(m => m.CategoriesListComponent)
    },
    {
        path: 'add',
        title: 'Nueva Categoría',
        loadComponent: () => import('./add/add-category.component').then(m => m.AddCategoryComponent)
    },
    {
        path: 'edit/:id',
        title: 'Editar Categoría',
        loadComponent: () => import('./edit/edit-category.component').then(m => m.EditCategoryComponent)
    }
];
