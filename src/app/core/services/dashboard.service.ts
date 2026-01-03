import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { delay, of } from 'rxjs'; // Para simular datos por ahora
import { DashboardResponse } from '../../shared/models/dashboard/dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private API_URL = environment.apiUrl;

  getDashboardSummary() {
    // --- MODO REAL (Descomentar cuando el backend esté listo) ---
    // return this.http.get<DashboardResponse>(`${this.API_URL}/dashboard/summary`);

    // --- MODO SIMULACIÓN (Para que veas la vista funcionando ya) ---
    const mockData = {
      success: true,
      message: 'Datos obtenidos',
      status: 200,
      timestamp: new Date().toISOString(),
      data: {
        kpis: {
          totalSalesToday: 1520.5,
          newClientsThisMonth: 45,
          pendingOrders: 12,
          lowStockProducts: 5,
        },
        salesChartLabels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        salesChartData: [650, 590, 800, 810, 1200, 1500, 950],
        recentOrders: [
          {
            id: 101,
            clientName: 'María López',
            total: 250,
            status: 'COMPLETED',
            date: '2023-10-25',
          },
          { id: 102, clientName: 'Carlos Ruiz', total: 120, status: 'PENDING', date: '2023-10-25' },
          { id: 103, clientName: 'Ana Polo', total: 450, status: 'SHIPPED', date: '2023-10-24' },
          {
            id: 104,
            clientName: 'Pedro Sanchez',
            total: 85,
            status: 'PENDING',
            date: '2023-10-24',
          },
        ],
      },
    };
    // Simulamos 1 segundo de retraso de red
    return of(mockData).pipe(delay(1000));
  }
}
