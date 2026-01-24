import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Role } from '@shared/models/role/role.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig, TableActionEvent } from '@shared/models/table';
import { ConfirmService } from '@core/services/confirm.service';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TableListComponent],
  templateUrl: './roles-list.component.html',
})
export class RolesListComponent extends PageConfiguration implements OnInit {
  private readonly confirmService = inject(ConfirmService);

  public roles = signal<Role[]>([]);
  public loading = signal<boolean>(false);
  public searchQuery = signal('');

  public tableColumns: ColumnConfig[] = [
    { key: 'name', label: 'Nombre del Rol', type: 'text', sortable: true },
    { key: 'note', label: 'Descripción/Notas', type: 'text', sortable: true },
    { key: 'actions', label: '', type: 'action' },
  ];

  public filteredRoles = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.roles();
    return this.roles().filter(r =>
      r.name.toLowerCase().includes(query) ||
      (r.note && r.note.toLowerCase().includes(query))
    );
  });

  ngOnInit(): void {
    this.loadRoles();
  }

  async loadRoles() {
    this.loading.set(true);
    try {
      // Assuming endpoint is /role as per implementation plan
      const response: any = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return await bridge.get('/role');
      });
      // Handle potential pagination if /role returns PaginatedResponse
      this.roles.set(Array.isArray(response) ? response : response.content || []);
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
        this.deleteRole(item);
        break;
      default:
        this.logger.warnign('Acción no reconocida:', type);
    }
  }

  goToAdd() {
    this.nav.push(APP_ROUTES.nav.roles.add);
  }

  goToEdit(id: number) {
    this.nav.push(APP_ROUTES.nav.roles.edit(id));
  }

  async deleteRole(role: Role) {
    const confirmed = await this.confirmService.open({
      title: 'Eliminar Rol',
      message: `¿Estás seguro de que deseas eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`,
      btnConfirmText: 'Eliminar',
      btnCancelText: 'Cancelar',
      variant: 'danger',
    });

    if (confirmed) {
      try {
        await this.rustService.call(async (bridge: GenericHttpBridge) => {
          return await bridge.delete(`/role/${role.id}`);
        });
        this.toast.show('Rol eliminado correctamente', 'success');
        this.loadRoles();
      } catch (error) {
        this.provideError(error);
      }
    }
  }
}
