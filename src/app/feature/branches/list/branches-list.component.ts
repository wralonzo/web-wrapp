import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Branch } from '@shared/models/branch/branch.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig, TableActionEvent } from '@shared/models/table';
import { ConfirmService } from '@core/services/confirm.service';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';

@Component({
  selector: 'app-branches-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TableListComponent],
  templateUrl: './branches-list.component.html',
})
export class BranchesListComponent extends PageConfiguration implements OnInit {
  private readonly confirmService = inject(ConfirmService);

  public branches = signal<Branch[]>([]);
  public loading = signal<boolean>(false);
  public searchQuery = signal('');

  public tableColumns: ColumnConfig[] = [
    { key: 'code', label: 'Código', type: 'text', sortable: true },
    { key: 'name', label: 'Nombre', type: 'text', sortable: true },
    { key: 'phone', label: 'Teléfono', type: 'text', sortable: true },
    { key: 'active', label: 'Estado', type: 'boolean', sortable: true },
    { key: 'actions', label: '', type: 'action' },
  ];

  public filteredBranches = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.branches();
    return this.branches().filter(b =>
      b.name.toLowerCase().includes(query) ||
      b.code.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadBranches();
  }

  async loadBranches() {
    this.loading.set(true);
    try {
      const response: PaginatedResponse<Branch> = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return await bridge.get('/branch');
      });
      this.logger.info(this.loadBranches.name, response);
      this.branches.set(response.content);
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
        this.deleteBranch(item.id);
        break;
      default:
        this.logger.warnign('Acción no reconocida:', type);
    }
  }

  goToAdd() {
    this.nav.push(APP_ROUTES.nav.branches.add);
  }

  goToEdit(id: number) {
    this.nav.push(APP_ROUTES.nav.branches.edit(id));
  }

  async deleteBranch(id: number) {
    const confirmed = await this.confirmService.open({
      title: 'Eliminar Sucursal',
      message: '¿Estás seguro de que deseas eliminar esta sucursal? Esta acción no se puede deshacer.',
      btnConfirmText: 'Eliminar',
      btnCancelText: 'Cancelar',
      variant: 'danger',
    });

    if (confirmed) {
      try {
        await this.rustService.call(async (bridge: GenericHttpBridge) => {
          return await bridge.patch(`/branch/${id}/delete`, {});
        });
        this.toast.show('Sucursal eliminada correctamente', 'success');
        this.loadBranches();
      } catch (error) {
        this.provideError(error);
      }
    }
  }
}
