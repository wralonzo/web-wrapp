// src/app/core/constants/routes.constants.ts

// 1. Segmentos base para evitar repeticiones
const AUTH_BASE = 'auth';
const APP_BASE = 'app';

export const APP_ROUTES = {
  // Rutas para la configuración de Routes[] (Relative Paths)
  definitions: {
    auth: AUTH_BASE,
    app: APP_BASE,
    login: 'login',
    dashboard: 'dashboard',
    clients: 'clients',
    users: 'users',
    reservations: 'reservations',
    products: 'products',
    roles: 'roles',
    branches: 'branches',
    warehouses: 'warehouses',
    permissions: 'permissions',
    positionTypes: 'positions',
    categories: 'categories',
    suppliers: 'suppliers',
    // Sub-rutas
    add: 'add',
    edit: 'edit/:id',
    view: 'view/:id',
    resetPassword: 'reset-password/:id',
  },

  // Rutas para usar en nav.push() o nav.setRoot() (Absolute Paths)
  nav: {
    login: `/${AUTH_BASE}/login`,
    dashboard: `/${APP_BASE}/dashboard`,

    clients: {
      list: `/${APP_BASE}/clients`,
      add: `/${APP_BASE}/clients/add`,
      edit: (id: string | number) => `/${APP_BASE}/clients/edit/${id}`,
      view: (id: string | number) => `/${APP_BASE}/clients/view/${id}`,
    },

    users: {
      list: `/${APP_BASE}/users`,
      add: `/${APP_BASE}/users/add`,
      edit: (id: string | number) => `/${APP_BASE}/users/edit/${id}`,
      view: (id: string | number) => `/${APP_BASE}/users/view/${id}`,
      resetPassword: (id: string | number) => `/${APP_BASE}/users/reset-password/${id}`,
    },

    reservations: {
      list: `/${APP_BASE}/reservations`,
      add: `/${APP_BASE}/reservations/add`,
      edit: (id: string | number) => `/${APP_BASE}/reservations/edit/${id}`,
    },

    products: {
      list: `/${APP_BASE}/products`,
      add: `/${APP_BASE}/products/add`,
      edit: (id: string | number) => `/${APP_BASE}/products/edit/${id}`,
      view: (id: string | number) => `/${APP_BASE}/products/view/${id}`,
    },

    roles: {
      list: `/${APP_BASE}/roles`,
      add: `/${APP_BASE}/roles/add`,
      edit: (id: string | number) => `/${APP_BASE}/roles/edit/${id}`,
    },

    branches: {
      list: `/${APP_BASE}/branches`,
      add: `/${APP_BASE}/branches/add`,
      edit: (id: string | number) => `/${APP_BASE}/branches/edit/${id}`,
    },

    warehouses: {
      list: `/${APP_BASE}/warehouses`,
      add: `/${APP_BASE}/warehouses/add`,
      edit: (id: string | number) => `/${APP_BASE}/warehouses/edit/${id}`,
    },

    positions: {
      list: `/${APP_BASE}/positions`,
      add: `/${APP_BASE}/positions/add`,
      edit: (id: string | number) => `/${APP_BASE}/positions/edit/${id}`,
    },

    categories: {
      list: `/${APP_BASE}/categories`,
      add: `/${APP_BASE}/categories/add`,
      edit: (id: string | number) => `/${APP_BASE}/categories/edit/${id}`,
    },

    suppliers: {
      list: `/${APP_BASE}/suppliers`,
      add: `/${APP_BASE}/suppliers/add`,
      edit: (id: string | number) => `/${APP_BASE}/suppliers/edit/${id}`,
    },

    permissions: {
      list: `/${APP_BASE}/permissions`,
      add: `/${APP_BASE}/permissions/add`,
      edit: (id: string | number) => `/${APP_BASE}/permissions/edit/${id}`,
    },
  },
} as const;
