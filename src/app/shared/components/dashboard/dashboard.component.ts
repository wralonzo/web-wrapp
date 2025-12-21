import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardData } from '../../models/dashboard/dashboard.interface';
import { ChartOptions, ChartConfiguration } from 'chart.js'; // 👈 Tipados actualizados
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective], // Agregamos el módulo de gráficas
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  // Signals para el estado
  public isLoading = signal<boolean>(true);
  public dashboardData = signal<DashboardData | null>(null);

  // Configuración de la Gráfica (Chart.js)
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
    },
  };
  public lineChartLegend = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.dashboardService.getDashboardSummary().subscribe({
      next: (response) => {
        if (response.success) {
          this.dashboardData.set(response.data as DashboardData);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando dashboard', err);
        this.isLoading.set(false);
        // Aquí podrías usar tu LoggerService
      },
    });
  }

  // Helper para clases CSS de estado
  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'badge-success';
      case 'PENDING':
        return 'badge-warning';
      case 'SHIPPED':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }
}
