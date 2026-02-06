import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SaleService } from '@core/services/sale.service';
import { Sale } from '@shared/models/inventory/sale.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig } from '@shared/models/table/column-config';
import { TableActionEvent } from '@shared/models/table/table-event.interface';
import { APP_ROUTES } from '@core/constants/routes.constants';

@Component({
    selector: 'app-list-sale',
    standalone: true,
    imports: [CommonModule, RouterLink, TableListComponent],
    templateUrl: './list-sale.component.html',
    styleUrl: './list-sale.component.scss',
})
export class ListSaleComponent extends PageConfiguration implements OnInit {
    public sales = signal<Sale[]>([]);

    // Pagination & Search signals
    public currentPage = signal(0);
    public pageSize = signal(10);
    public searchQuery = signal('');
    public totalItems = computed(() => this.sales().length);
    public totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

    public availableColumns: ColumnConfig[] = [
        { key: 'id', label: 'ID', type: 'text', sortable: true },
        { key: 'clientName', label: 'Cliente', type: 'text', sortable: true },
        { key: 'date', label: 'Fecha', type: 'date', sortable: true },
        { key: 'total', label: 'Total', type: 'currency', sortable: true },
        { key: 'type', label: 'Método Pago', type: 'text', sortable: true },
        { key: 'state', label: 'Estado', type: 'badge', sortable: true, color: 'blue' },
        { key: 'actions', label: 'Acciones', type: 'action' }
    ];

    constructor(private saleService: SaleService) {
        super();
    }

    async ngOnInit() {
        await this.loadSales();
    }

    public filteredSales = computed(() => {
        const query = this.searchQuery().toLowerCase();
        let filtered = this.sales().filter(s =>
            (s.clientName || '').toLowerCase().includes(query) ||
            s.state?.toLowerCase().includes(query)
        );

        const start = this.currentPage() * this.pageSize();
        const end = start + this.pageSize();
        return filtered.slice(start, end);
    });

    async loadSales() {
        try {
            const data = await this.saleService.getAll();
            this.sales.set(data);
        } catch (error) {
            this.provideError(error);
        }
    }

    handleTableAction(event: TableActionEvent) {
        const { type, item } = event;
        switch (type) {
            case 'edit':
                this.nav.push(`app/sales/edit/${item.id}`);
                break;
            case 'delete':
                this.deleteSale(item);
                break;
            default:
                console.warn('Unknown action', type);
        }
    }

    handleSearch(term: string) {
        this.searchQuery.set(term);
        this.currentPage.set(0);
    }

    async deleteSale(sale: Sale) {
        if (!confirm(`¿Estás seguro de eliminar la venta?`)) return;

        try {
            if (sale.id) {
                await this.saleService.delete(sale.id);
                await this.loadSales();
                this.toast.show('Venta eliminada correctamente', 'success');
            }
        } catch (error) {
            this.provideError(error);
        }
    }
}
