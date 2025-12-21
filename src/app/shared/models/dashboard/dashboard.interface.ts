import { HttpResponseApi } from '../http/http-response';

// KPIs: Indicadores Clave de Rendimiento (las tarjetas de arriba)
export interface KPIs {
  totalSalesToday: number;
  newClientsThisMonth: number;
  pendingOrders: number;
  lowStockProducts: number;
}

// Para la tabla de órdenes recientes
export interface RecentOrder {
  id: number;
  clientName: string;
  total: number;
  status: 'PENDING' | 'COMPLETED' | 'SHIPPED';
  date: string;
}

// El objeto completo que vendrá del backend
export interface DashboardData {
  kpis: KPIs;
  // Datos para la gráfica (ejemplo simplificado para ventas de últimos 7 días)
  salesChartLabels: string[]; // ej: ['Lun', 'Mar', 'Mie'...]
  salesChartData: number[]; // ej: [150, 230, 180...]
  recentOrders: RecentOrder[];
}

// La respuesta de la API envolviendo los datos
export type DashboardResponse = HttpResponseApi<DashboardData>;
