import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkOrderService } from '@core/services/work-order.service';
import { WorkOrder } from '@shared/models/inventory/work-order.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig } from '@shared/models/table/column-config';
import { TableActionEvent } from '@shared/models/table/table-event.interface';
import { APP_ROUTES } from '@core/constants/routes.constants';

@Component({
    selector: 'app-list-work-order',
    standalone: true,
    imports: [CommonModule, RouterLink, TableListComponent],
    templateUrl: './list-work-order.component.html',
    styleUrl: './list-work-order.component.scss',
})
export class ListWorkOrderComponent extends PageConfiguration implements OnInit {
    public workOrders = signal<WorkOrder[]>([]);

    // Pagination & Search signals
    public currentPage = signal(0);
    public pageSize = signal(10);
    public searchQuery = signal('');
    public totalItems = computed(() => this.workOrders().length);
    public totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

    public availableColumns: ColumnConfig[] = [
        { key: 'referenceNumber', label: 'Referencia', type: 'text', sortable: true },
        { key: 'clientName', label: 'Cliente', type: 'text', sortable: true },
        { key: 'createdAt', label: 'Fecha', type: 'date', sortable: true },
        { key: 'status', label: 'Estado', type: 'badge', sortable: true, color: 'blue' },
        { key: 'actions', label: 'Acciones', type: 'action' }
    ];

    constructor(private workOrderService: WorkOrderService) {
        super();
    }

    async ngOnInit() {
        await this.loadWorkOrders();
    }

    public filteredWorkOrders = computed(() => {
        const query = this.searchQuery().toLowerCase();
        let filtered = this.workOrders().filter(o =>
            (o.referenceNumber || '').toLowerCase().includes(query) ||
            (o.clientName || '').toLowerCase().includes(query) ||
            o.status.toLowerCase().includes(query)
        );

        const start = this.currentPage() * this.pageSize();
        const end = start + this.pageSize();
        return filtered.slice(start, end);
    });

    async loadWorkOrders() {
        try {
            const data = await this.workOrderService.getAll();
            this.workOrders.set(data.content);
        } catch (error) {
            this.provideError(error);
        }
    }

    handleTableAction(event: TableActionEvent) {
        const { type, item } = event;
        switch (type) {
            case 'edit':
                this.nav.push(`app/work-orders/edit/${item.id}`);
                break;
            case 'delete':
                this.deleteOrder(item);
                break;
            default:
                console.warn('Unknown action', type);
        }
    }

    handleSearch(term: string) {
        this.searchQuery.set(term);
        this.currentPage.set(0);
    }

    async deleteOrder(order: WorkOrder) {
        if (!confirm(`¿Estás seguro de eliminar la orden de trabajo?`)) return;

        try {
            if (order.id) {
                await this.workOrderService.delete(order.id);
                await this.loadWorkOrders();
                this.toast.show('Orden eliminada correctamente', 'success');
            }
        } catch (error) {
            this.provideError(error);
        }
    }
}
