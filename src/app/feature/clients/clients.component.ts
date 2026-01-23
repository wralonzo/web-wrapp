import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../shared/models/client/client.interface';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ColumnConfig, FilterConfig } from '@shared/models/table/column-config';
import { TableActionEvent } from '@shared/models/table/table-event.interface';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ConfirmService } from '@core/services/confirm.service';
import { ClientTypes } from '@shared/enums/clients/Client-type.enum';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop'; // Importante
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { SelectOption } from '../../shared/models/select/option.interface';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { PageConfiguration } from 'src/app/page-configurations';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, TableListComponent],
  templateUrl: './clients.component.html',
})
export class ClientsComponent extends PageConfiguration implements OnInit {
  private confirmService = inject(ConfirmService);

  public clientColumns: ColumnConfig[] = [
    { key: 'code', label: 'Código', type: 'text', sortable: true },
    { key: 'profile.fullName', label: 'Nombre', type: 'text', sortable: true },
    { key: 'profile.phone', label: 'Teléfono', type: 'text', sortable: true },
    { key: 'profile.email', label: 'Correo', type: 'text', sortable: true },
    { key: 'profile.address', label: 'Dirección', type: 'text', sortable: true },
    { key: 'clientType', label: 'Tipo', type: 'badge', sortable: true, color: 'blue' },
    { key: 'actions', label: '', type: 'action' },
  ];

  public filters: FilterConfig[] = [
    {
      key: 'clientType',
      label: 'Tipo de cliente',
      selectedName: 'todos',
      options: [
        { value: 'ALL', label: 'Todos' },
        { value: ClientTypes.REGULAR, label: 'Regular' },
        { value: ClientTypes.VIP, label: 'VIP' },
        { value: ClientTypes.WHOLESALER, label: 'MAYORISTA' },
        { value: ClientTypes.PREMIUM, label: 'PREMIUM' },
      ],
    },
  ];

  public totalItems = signal(0);
  public currentPage = signal(0);
  public totlPages = signal(0);
  public pageSize = signal(10);
  public loading = signal(false);
  private activeParams = signal<Record<string, any>>({
    sort: 'code,desc',
  });

  public clients = signal<Client[]>([]);

  public searchQuery = signal('');
  public clientType = signal<ClientTypes | null>(null);

  constructor() {
    super();
    toObservable(this.searchQuery)
      .pipe(
        skip(1), // <--- IMPORTANTE: Ignora el valor inicial al cargar
        debounceTime(2000), // 400ms es más natural que 2000ms
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.currentPage.set(0);
        this.loadClients();
      });

    // 2. Manejo de tamaño de página (sin debounce o muy corto)
    toObservable(this.pageSize)
      .pipe(
        skip(1), // <--- Ignora el valor inicial
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.currentPage.set(0);
        this.loadClients();
      });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  public filteredClients = computed(() => {
    this.searchQuery().toLowerCase().trim();
    return this.clients();
  });

  public addClient(): void {
    this.nav.push(`${APP_ROUTES.nav.clients.add}`);
    this.logger.log('Agregar nuevo cliente');
  }

  public async loadClients() {
    this.loading.set(true);
    try {
      const url = `/client?term=${this.searchQuery()}&clientType=${this.activeParams()['clientType'] ?? ''
        }&page=${this.currentPage()}&size=${this.pageSize()}&sort=${this.activeParams()['sort'] ?? 'code,desc'
        }`;

      const clients: PaginatedResponse<Client> = await this.rustService.call(async (bridge) => {
        return await bridge.get(url);
      });
      this.clients.set(clients.content);
      this.totalItems.set(clients.totalElements);
      this.totlPages.set(clients.totalPages);
      this.loading.set(false);
      this.logger.log('Clientes cargados:', this.clients());
    } catch (error: any) {
      this.logger.error(this.loadClients.name, error);
      this.provideError(error);
    }
  }

  handleTableAction(event: TableActionEvent) {
    const { type, item } = event;

    switch (type) {
      case 'edit':
        this.goToEditClient(item.id);
        break;
      case 'delete':
        this.confirmDeleteClient(item);
        break;
      case 'view':
        this.goToViewClient(item.id);
        break;
      default:
        this.logger.warnign('Acción no reconocida:', type);
    }
  }

  // --- Lógica específica por acción ---

  private goToEditClient(id: string) {
    this.logger.log('Navegando a editar cliente con ID:', id);
    this.nav.push(APP_ROUTES.nav.clients.edit(id));
  }

  private goToViewClient(id: string) {
    this.logger.log('Navegando a editar cliente con ID:', id);
    this.nav.push(APP_ROUTES.nav.clients.view(id));
  }

  private async confirmDeleteClient(client: any) {
    try {
      const confirmed = await this.confirmService.open({
        title: 'Eliminar Cliente',
        message: `¿Estás seguro de eliminar a ${client.name}? Esta acción borrará permanentemente sus facturas y registros.`,
        btnConfirmText: 'Sí, eliminar ahora',
        btnCancelText: 'No, cancelar',
        variant: 'danger',
      });
      if (confirmed) {
        await this.rustService.call(async (bridge: GenericHttpBridge) => {
          return await bridge.patch(`/client/${client.id}/delete`, null);
        });
        const clientDeteleted = this.clients().filter((c) => c.id !== client.id);
        this.logger.info('Cliente eliminado:', clientDeteleted);
        this.totalItems.set(clientDeteleted.length);
        this.clients.set(clientDeteleted);
        this.toast.show('Cliente eliminado', 'success');
      }
    } catch (error) {
      this.provideError(error);
    }
  }

  handleFilter(filterUpdate: Record<string, any>) {
    // 1. Extraemos la llave y el valor (ej: key='status', value='VIP')
    const [key, value] = Object.entries(filterUpdate)[0] as [string, SelectOption];
    this.logger.info('Filtro cambiado:', { key, value });
    if (value.value === 'ALL') {
      value.value = '';
    }
    this.activeParams.update((prev) => ({ ...prev, [key]: value.value }));
    this.filters[0].selectedName = String(value.value);
    this.currentPage.set(0);
    this.loadClients();
  }

  handleSort(event: { key: string; dir: 'asc' | 'desc' }) {
    this.activeParams.update((prev) => ({
      sort: `${event.key},${event.dir}`,
    }));
    this.logger.info('Ordenando por:', event);
    this.loadClients();
  }

  handlePage(page: number) {
    this.currentPage.set(page);
    this.loadClients();
  }
}
