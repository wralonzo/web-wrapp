import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductBundleService } from '@core/services/product-bundle.service';
import { ProductBundle } from '@shared/models/inventory/product-bundle.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig } from '@shared/models/table/column-config';
import { TableActionEvent } from '@shared/models/table/table-event.interface';
import { APP_ROUTES } from '@core/constants/routes.constants';

@Component({
    selector: 'app-list-product-bundle',
    standalone: true,
    imports: [CommonModule, RouterLink, TableListComponent],
    templateUrl: './list-product-bundle.component.html',
    styleUrl: './list-product-bundle.component.scss',
})
export class ListProductBundleComponent extends PageConfiguration implements OnInit {
    public bundles = signal<ProductBundle[]>([]);

    // Pagination & Search signals
    public currentPage = signal(0);
    public pageSize = signal(10);
    public searchQuery = signal('');
    public totalItems = computed(() => this.bundles().length);
    public totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

    public availableColumns: ColumnConfig[] = [
        { key: 'parentProduct.name', label: 'Producto Padre (Combo)', type: 'text', sortable: true },
        { key: 'componentProduct.name', label: 'Componente', type: 'text', sortable: true },
        { key: 'quantity', label: 'Cantidad', type: 'text', sortable: true },
        { key: 'actions', label: 'Acciones', type: 'action' }
    ];

    constructor(private productBundleService: ProductBundleService) {
        super();
    }

    async ngOnInit() {
        await this.loadBundles();
    }

    public filteredBundles = computed(() => {
        const query = this.searchQuery().toLowerCase();
        let filtered = this.bundles().filter(b =>
            (b.parentProduct?.name || '').toLowerCase().includes(query) ||
            (b.componentProduct?.name || '').toLowerCase().includes(query)
        );

        const start = this.currentPage() * this.pageSize();
        const end = start + this.pageSize();
        return filtered.slice(start, end);
    });

    async loadBundles() {
        try {
            const data = await this.productBundleService.getAll();
            this.bundles.set(data);
        } catch (error) {
            this.provideError(error);
        }
    }

    handleTableAction(event: TableActionEvent) {
        const { type, item } = event;
        switch (type) {
            case 'edit':
                this.nav.push(`app/product-bundles/edit/${item.id}`);
                break;
            case 'delete':
                this.deleteBundle(item);
                break;
            default:
                console.warn('Unknown action', type);
        }
    }

    handleSearch(term: string) {
        this.searchQuery.set(term);
        this.currentPage.set(0);
    }

    async deleteBundle(bundle: ProductBundle) {
        if (!confirm(`¿Estás seguro de eliminar el combo?`)) return;

        try {
            if (bundle.id) {
                await this.productBundleService.delete(bundle.id);
                await this.loadBundles();
                this.toast.show('Combo eliminado correctamente', 'success');
            }
        } catch (error) {
            this.provideError(error);
        }
    }
}
