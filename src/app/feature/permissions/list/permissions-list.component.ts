import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Permission } from '@shared/models/permission/permission.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig, FilterConfig, TableActionEvent } from '@shared/models/table';
import { ConfirmService } from '@core/services/confirm.service';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip, debounceTime, distinctUntilChanged } from 'rxjs';
import { SelectOption } from '@shared/models/select/option.interface';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-permissions-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TableListComponent],
  templateUrl: './permissions-list.component.html',
})
export class PermissionsListComponent extends PageConfiguration implements OnInit {
  private readonly confirmService = inject(ConfirmService);

  public permissions = signal<Permission[]>([]);
  public loading = signal<boolean>(false);
  public totalItems = signal(0);
  public currentPage = signal(0);
  public totalPages = signal(0);
  public pageSize = signal(10);

  private readonly activeParams = signal<Record<string, any>>({
    sort: 'id,asc',
  });

  public filters = signal<FilterConfig[]>([]);

  public searchQuery = signal('');

  public tableColumns: ColumnConfig[] = [
    { key: 'name', label: 'Nombre del Permiso', type: 'text', sortable: true },
    { key: 'description', label: 'Descripción', type: 'text', sortable: true },
    { key: 'actions', label: '', type: 'action' },
  ];

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
        this.loadPermissions();
      });

    // 2. Manejo de tamaño de página (sin debounce o muy corto)
    toObservable(this.pageSize)
      .pipe(
        skip(1), // <--- Ignora el valor inicial
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.currentPage.set(0);
        this.loadPermissions();
      });
  }

  public filteredPermissions = computed(() => {
    this.searchQuery().toLowerCase().trim();
    return this.permissions();
  });

  ngOnInit(): void {
    this.loadPermissions();
  }

  async loadPermissions() {
    this.loading.set(true);
    try {
      const params = {
        ...this.activeParams(),
        term: this.searchQuery() ?? '', // Enviamos el término al backend
        page: this.currentPage(),
        size: this.pageSize(),
      };
      const queryString = new HttpParams({ fromObject: params }).toString();
      const response: PaginatedResponse<Permission> = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return await bridge.get(`/permission?${queryString}`);
      });
      this.logger.info(this.loadPermissions.name, response);
      this.permissions.set(response.content);
      this.totalItems.set(response.totalElements);
      this.totalPages.set(response.totalPages);
      this.pageSize.set(response.size);
    } catch (error) {
      this.provideError(error);
    } finally {
      this.loading.set(false);
    }
  }

  handleTableAction(event: TableActionEvent) {
    const { type, item } = event;
    switch (type) {
      case 'edit':
        this.goToEdit(item.id);
        break;
      case 'delete':
        this.deletePermission(item.id);
        break;
      default:
        this.logger.warnign('Acción no reconocida:', type);
    }
  }

  goToAdd() {
    this.nav.push(APP_ROUTES.nav.permissions.add);
  }

  goToEdit(id: number) {
    this.nav.push(APP_ROUTES.nav.permissions.edit(id));
  }

  async deletePermission(id: number) {
    const confirmed = await this.confirmService.open({
      title: 'Eliminar Permiso',
      message: '¿Estás seguro de que deseas eliminar este permiso? Esta acción no se puede deshacer.',
      btnConfirmText: 'Eliminar',
      btnCancelText: 'Cancelar',
      variant: 'danger',
    });

    if (confirmed) {
      try {
        await this.rustService.call(async (bridge: GenericHttpBridge) => {
          return await bridge.patch(`/permission/${id}/delete`, {});
        });
        this.toast.show('Permiso eliminado correctamente', 'success');
        this.loadPermissions();
      } catch (error) {
        this.provideError(error);
      }
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
    this.filters()[0].selectedName = String(value.value);
    this.currentPage.set(0);
    this.loadPermissions();
  }

  handleSort(event: { key: string; dir: 'asc' | 'desc' }) {
    this.activeParams.update((prev) => ({
      sort: `${event.key},${event.dir}`,
    }));
    this.logger.info('Ordenando por:', event);
    this.loadPermissions();
  }

  handlePage(page: number) {
    this.currentPage.set(page);
    this.loadPermissions();
  }
}
