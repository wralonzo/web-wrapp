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
  },
} as const;
