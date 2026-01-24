import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Warehouse } from '@shared/models/warehouse/warehouse.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig, TableActionEvent } from '@shared/models/table';
import { ConfirmService } from '@core/services/confirm.service';

@Component({
  selector: 'app-warehouses-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TableListComponent],
  templateUrl: './warehouses-list.component.html',
})
export class WarehousesListComponent extends PageConfiguration implements OnInit {
  private readonly confirmService = inject(ConfirmService);

  public warehouses = signal<Warehouse[]>([]);
  public loading = signal<boolean>(false);
  public searchQuery = signal('');

  public tableColumns: ColumnConfig[] = [
    { key: 'code', label: 'Código', type: 'text', sortable: true },
    { key: 'name', label: 'Nombre', type: 'text', sortable: true },
    { key: 'phone', label: 'Teléfono', type: 'text', sortable: true },
    { key: 'active', label: 'Estado', type: 'boolean', sortable: true },
    { key: 'actions', label: '', type: 'action' },
  ];

  public filteredWarehouses = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.warehouses();
    return this.warehouses().filter(w =>
      w.name.toLowerCase().includes(query) ||
      w.code.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadWarehouses();
  }

  async loadWarehouses() {
    this.loading.set(true);
    try {
      const response: Warehouse[] = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return await bridge.get('/warehouse');
      });
      this.warehouses.set(response);
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
        this.deleteWarehouse(item.id);
        break;
      default:
        this.logger.warnign('Acción no reconocida:', type);
    }
  }

  goToAdd() {
    this.nav.push(APP_ROUTES.nav.warehouses.add);
  }

  goToEdit(id: number) {
    this.nav.push(APP_ROUTES.nav.warehouses.edit(id));
  }

  async deleteWarehouse(id: number) {
    const confirmed = await this.confirmService.open({
      title: 'Eliminar Almacén',
      message: '¿Estás seguro de que deseas eliminar este almacén? Esta acción no se puede deshacer.',
      btnConfirmText: 'Eliminar',
      btnCancelText: 'Cancelar',
      variant: 'danger',
    });

    if (confirmed) {
      try {
        await this.rustService.call(async (bridge: GenericHttpBridge) => {
          return await bridge.delete(`/warehouse/${id}`);
        });
        this.toast.show('Almacén eliminado correctamente', 'success');
        this.loadWarehouses();
      } catch (error) {
        this.provideError(error);
      }
    }
  }
}
