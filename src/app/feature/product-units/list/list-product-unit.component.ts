import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductUnitService } from '@core/services/product-unit.service';
import { ProductUnit } from '@shared/models/product-unit/product-unit.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig } from '@shared/models/table/column-config';
import { TableActionEvent } from '@shared/models/table/table-event.interface';
import { APP_ROUTES } from '@core/constants/routes.constants';

@Component({
    selector: 'app-list-product-unit',
    standalone: true,
    imports: [CommonModule, RouterLink, TableListComponent],
    templateUrl: './list-product-unit.component.html',
    styleUrl: './list-product-unit.component.scss',
})
export class ListProductUnitComponent extends PageConfiguration implements OnInit {
    public units = signal<ProductUnit[]>([]);

    // Pagination & Search signals
    public currentPage = signal(0);
    public pageSize = signal(10);
    public searchQuery = signal('');
    public totalItems = computed(() => this.units().length);
    public totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

    public availableColumns: ColumnConfig[] = [
        { key: 'name', label: 'Nombre', type: 'text', sortable: true },
        { key: 'conversionFactor', label: 'Conversor', type: 'text', sortable: true },
        { key: 'barcode', label: 'Barcode', type: 'boolean', color: 'green' }, // Assuming boolean logic or custom render, but based on prev html it was just text/presence
        { key: 'actions', label: 'Acciones', type: 'action' }
    ];

    constructor(private productUnitService: ProductUnitService) {
        super();
    }

    async ngOnInit() {
        await this.loadUnits();
    }

    // Client-side filtering and pagination
    public filteredUnits = computed(() => {
        const query = this.searchQuery().toLowerCase();
        let filtered = this.units().filter(u =>
            u.name.toLowerCase().includes(query) ||
            (u.barcode && u.barcode.toLowerCase().includes(query))
        );

        const start = this.currentPage() * this.pageSize();
        const end = start + this.pageSize();
        return filtered.slice(start, end);
    });

    async loadUnits() {
        try {
            const data = await this.productUnitService.getAll();
            this.units.set(data);
        } catch (error) {
            this.provideError(error);
        }
    }

    handleTableAction(event: TableActionEvent) {
        const { type, item } = event;
        switch (type) {
            case 'edit':
                this.nav.push(`app/product-units/edit/${item.id}`);
                break;
            case 'delete':
                this.deleteUnit(item);
                break;
            default:
                console.warn('Unknown action', type);
        }
    }

    // Since TableListComponent emits search term
    handleSearch(term: string) {
        this.searchQuery.set(term);
        this.currentPage.set(0);
    }

    async deleteUnit(unit: ProductUnit) {
        if (!confirm(`¿Estás seguro de eliminar la unidad ${unit.name}?`)) return;

        try {
            if (unit.id) {
                await this.productUnitService.delete(unit.id);
                await this.loadUnits();
                this.toast.show('Unidad eliminada correctamente', 'success');
            }
        } catch (error) {
            this.provideError(error);
        }
    }
}
