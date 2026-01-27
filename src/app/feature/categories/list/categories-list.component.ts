import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Category } from '@shared/models/category/category.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig, TableActionEvent } from '@shared/models/table';
import { ConfirmService } from '@core/services/confirm.service';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';

@Component({
    selector: 'app-categories-list',
    standalone: true,
    imports: [CommonModule, ButtonComponent, TableListComponent],
    templateUrl: './categories-list.component.html',
})
export class CategoriesListComponent extends PageConfiguration implements OnInit {
    private readonly confirmService = inject(ConfirmService);

    public categories = signal<Category[]>([]);
    public loading = signal<boolean>(false);
    public searchQuery = signal('');

    public tableColumns: ColumnConfig[] = [
        { key: 'code', label: 'Código', type: 'text', sortable: true },
        { key: 'name', label: 'Nombre de Categoría', type: 'text', sortable: true },
        { key: 'notes', label: 'Notas', type: 'text', sortable: true },
        { key: 'actions', label: '', type: 'action' },
    ];

    public filteredCategories = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        if (!query) return this.categories();
        return this.categories().filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.code.toLowerCase().includes(query)
        );
    });

    ngOnInit(): void {
        this.loadCategories();
    }

    async loadCategories() {
        this.loading.set(true);
        try {
            const response: PaginatedResponse<Category> = await this.rustService.call(async (bridge: GenericHttpBridge) => {
                return await bridge.get('/category');
            });
            this.logger.info(this.loadCategories.name, response);
            this.categories.set(response.content);
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
                this.deleteCategory(item.id);
                break;
            default:
                this.logger.warnign('Acción no reconocida:', type);
        }
    }

    goToAdd() {
        this.nav.push(APP_ROUTES.nav.categories.add);
    }

    goToEdit(id: number) {
        this.nav.push(APP_ROUTES.nav.categories.edit(id));
    }

    async deleteCategory(id: number) {
        const confirmed = await this.confirmService.open({
            title: 'Eliminar Categoría',
            message: '¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.',
            btnConfirmText: 'Eliminar',
            btnCancelText: 'Cancelar',
            variant: 'danger',
        });

        if (confirmed) {
            try {
                await this.rustService.call(async (bridge: GenericHttpBridge) => {
                    return await bridge.patch(`/category/${id}/delete`, {});
                });
                this.toast.show('Categoría eliminada correctamente', 'success');
                this.loadCategories();
            } catch (error) {
                this.provideError(error);
            }
        }
    }
}
