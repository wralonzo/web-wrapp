import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../shared/models/client/client.interface';
import { SelectOption } from '../../shared/models/select/option.interface';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { ClientService } from '../../core/services/client.service';
import { ColumnConfig, FilterConfig } from '@shared/models/table/column-config';
import { TableActionEvent } from '@shared/models/table/table-event.interface';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { LoggerService } from '@core/services/logger.service';
import { ConfirmService } from '@core/services/confirm.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, TableListComponent],
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {
  // Datos de prueba (esto vendría de tu ClientsService)
  private clientService = inject(ClientService);
  private logger = inject(LoggerService);
  private router = inject(Router);
  private confirmService = inject(ConfirmService);
  private toast = inject(ToastService);

  public clientColumns: ColumnConfig[] = [
    { key: 'id', label: 'Nombre', type: 'text', sortable: true },
    { key: 'name', label: 'Nombre', type: 'text', sortable: true },
    { key: 'phone', label: 'Teléfono', type: 'text', sortable: true },
    { key: 'email', label: 'Correo', type: 'text', sortable: true },
    { key: 'address', label: 'Dirección', type: 'text', sortable: true },
    { key: 'clientType', label: 'Tipo', type: 'badge', sortable: true },
    { key: 'actions', label: '', type: 'action' },
  ];

  public filters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Estado',
      options: [
        { label: 'Todos', value: '' },
        { label: 'VIP', value: 1 },
        { label: 'REGULAR', value: 2 },
      ],
    },
  ];
  public totalItems = signal(0);
  public currentPage = signal(1);
  public pageSize = 10;
  public loading = signal(false);
  private activeParams = signal<Record<string, any>>({});

  public clients = signal<Client[]>([]);

  public searchQuery = signal('');

  public options: SelectOption[] = [
    { value: 1, label: 'Ana García' },
    { value: 2, label: 'Roberto Carlos' },
    { value: 3, label: 'Elena Martínez' },
  ];

  ngOnInit(): void {
    this.loadClients();
  }

  public filteredClients = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allClients = this.clients();

    // Si no hay búsqueda, devolvemos todo inmediatamente
    if (!query) return allClients;

    return allClients.filter((c) => {
      // Verificación segura de nulidad antes de procesar
      const name = (c.name || '').toLowerCase();
      const phone = (c.phone || '').toLowerCase();
      const email = (c.email || '').toLowerCase();

      return name.includes(query) || phone.includes(query) || email.includes(query);
    });
  });

  public addClient(): void {
    this.router.navigate(['/app/clients/add']);
    console.log('Agregar nuevo cliente');
  }

  public loadClients() {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients.set(clients.data as Client[]);
        this.logger.log('Clientes cargados:', this.clients());
      },
      error: (err) => {
        this.clients.set([]);
        console.error('Error al cargar los clientes:', err);
      },
    });
  }

  handleTableAction(event: TableActionEvent) {
    // Usamos la interfaz aquí
    const { type, item } = event;

    switch (type) {
      case 'edit':
        this.goToEditClient(item.id);
        break;
      case 'delete':
        this.confirmDeleteClient(item);
        break;
      case 'view':
        console.log('Viendo detalles de:', item.name);
        break;
      default:
        console.warn('Acción no reconocida:', type);
    }
  }

  // --- Lógica específica por acción ---

  private goToEditClient(id: string) {
    // Navegamos a la ruta de edición: /clients/edit/123
    console.log('Navegando a editar cliente con ID:', id);
    this.router.navigate(['/app/clients/edit', id]);
  }

  private async confirmDeleteClient(client: any) {
    const confirmed = await this.confirmService.open({
      title: 'Eliminar Cliente',
      message: `¿Estás seguro de eliminar a ${client.name}? Esta acción borrará permanentemente sus facturas y registros.`,
      btnConfirmText: 'Sí, eliminar ahora',
      btnCancelText: 'No, cancelar',
      variant: 'danger',
    });
    if (confirmed) {
      this.clientService.deleteClient(client.id).subscribe({
        next: () => {
          const clientDeteleted = this.clients().filter((c) => c.id !== client.id);
          this.clients.set(clientDeteleted);
          this.toast.show('Cliente eliminado', 'success');
        },
        error: () => this.toast.show('Error al eliminar', 'error'),
      });
    }
  }

  handleFilter(filterValue: Record<string, any>) {
    // Actualizamos los parámetros y volvemos a la página 1
    this.activeParams.update((prev) => ({ ...prev, ...filterValue }));
    this.currentPage.set(1);
    this.loadClients();
  }

  handleSort(event: { key: string; dir: 'asc' | 'desc' }) {
    this.activeParams.update((prev) => ({
      ...prev,
      sort: event.key,
      order: event.dir,
    }));
    this.loadClients();
  }

  handlePage(page: number) {
    this.currentPage.set(page);
    this.loadClients();
  }
}
