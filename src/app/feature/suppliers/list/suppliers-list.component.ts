import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Supplier } from '@shared/models/supplier/supplier.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig, TableActionEvent } from '@shared/models/table';
import { ConfirmService } from '@core/services/confirm.service';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';

@Component({
    selector: 'app-suppliers-list',
    standalone: true,
    imports: [CommonModule, ButtonComponent, TableListComponent],
    templateUrl: './suppliers-list.component.html',
})
export class SuppliersListComponent extends PageConfiguration implements OnInit {
    private readonly confirmService = inject(ConfirmService);

    public suppliers = signal<Supplier[]>([]);
    public loading = signal<boolean>(false);
    public searchQuery = signal('');

    public tableColumns: ColumnConfig[] = [
        { key: 'name', label: 'Nombre Comercial', type: 'text', sortable: true },
        { key: 'companyName', label: 'Razón Social', type: 'text', sortable: true },
        { key: 'phone', label: 'Teléfono', type: 'text', sortable: true },
        { key: 'email', label: 'Correo', type: 'text', sortable: true },
        { key: 'actions', label: '', type: 'action' },
    ];

    public filteredSuppliers = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        if (!query) return this.suppliers();
        return this.suppliers().filter(s =>
            s.name.toLowerCase().includes(query) ||
            s.companyName.toLowerCase().includes(query) ||
            s.email.toLowerCase().includes(query)
        );
    });

    ngOnInit(): void {
        this.loadSuppliers();
    }

    async loadSuppliers() {
        this.loading.set(true);
        try {
            const response: PaginatedResponse<Supplier> = await this.rustService.call(async (bridge: GenericHttpBridge) => {
                return await bridge.get('/supplier');
            });
            this.logger.info(this.loadSuppliers.name, response);
            this.suppliers.set(response.content);
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
                this.deleteSupplier(item.id);
                break;
            default:
                this.logger.warnign('Acción no reconocida:', type);
        }
    }

    goToAdd() {
        this.nav.push(APP_ROUTES.nav.suppliers.add);
    }

    goToEdit(id: number) {
        this.nav.push(APP_ROUTES.nav.suppliers.edit(id));
    }

    async deleteSupplier(id: number) {
        const confirmed = await this.confirmService.open({
            title: 'Eliminar Proveedor',
            message: '¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.',
            btnConfirmText: 'Eliminar',
            btnCancelText: 'Cancelar',
            variant: 'danger',
        });

        if (confirmed) {
            try {
                await this.rustService.call(async (bridge: GenericHttpBridge) => {
                    return await bridge.patch(`/supplier/${id}/delete`, {});
                });
                this.toast.show('Proveedor eliminado correctamente', 'success');
                this.loadSuppliers();
            } catch (error) {
                this.provideError(error);
            }
        }
    }
}
