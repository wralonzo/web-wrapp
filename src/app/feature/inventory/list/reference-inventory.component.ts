import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '@core/services/inventory.service';
import { Inventory } from '@shared/models/inventory/inventory.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig } from '@shared/models/table/column-config';
import { TableActionEvent } from '@shared/models/table/table-event.interface';

interface InventoryTableItem {
    id: string | number;
    productName: string;
    productSku: string;
    quantity: number;
    quantityReserved: number;
    available: number;
    status: string; // 'LOW_STOCK' | 'NORMAL'
    original: Inventory;
}

@Component({
    selector: 'app-reference-inventory',
    standalone: true,
    imports: [CommonModule, TableListComponent],
    templateUrl: './reference-inventory.component.html',
    styleUrl: './reference-inventory.component.scss',
})
export class ReferenceInventoryComponent extends PageConfiguration implements OnInit {
    public inventory = signal<Inventory[]>([]);

    // Pagination & Search signals
    public currentPage = signal(0);
    public pageSize = signal(10);
    public searchQuery = signal('');

    // Computed mapped data
    public mappedInventory = computed<InventoryTableItem[]>(() => {
        return this.inventory().map(item => ({
            id: item.id || '',
            productName: item.product?.name || 'N/A',
            productSku: item.product?.sku || 'N/A',
            quantity: item.quantity,
            quantityReserved: item.quantityReserved,
            available: item.quantity - item.quantityReserved,
            status: item.quantity <= item.alertQuantity ? 'LOW_STOCK' : 'NORMAL',
            original: item
        }));
    });

    public totalItems = computed(() => this.mappedInventory().length);
    public totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

    public availableColumns: ColumnConfig[] = [
        { key: 'productName', label: 'Producto', type: 'text', sortable: true },
        { key: 'productSku', label: 'SKU', type: 'text', sortable: true },
        { key: 'quantity', label: 'Físico', type: 'text', sortable: true }, // Maybe number type if supported, else text is fine
        { key: 'quantityReserved', label: 'Reservado', type: 'text', sortable: true, color: 'orange' }, // Color hint if text supports it? Probably not standard but worth a try or just text
        { key: 'available', label: 'Disponible', type: 'text', sortable: true, color: 'green' },
        { key: 'status', label: 'Estado', type: 'badge', sortable: true }
    ];

    constructor(private inventoryService: InventoryService) {
        super();
    }

    async ngOnInit() {
        await this.loadInventory();
    }

    public filteredInventory = computed(() => {
        const query = this.searchQuery().toLowerCase();
        let filtered = this.mappedInventory().filter(i =>
            i.productName.toLowerCase().includes(query) ||
            i.productSku.toLowerCase().includes(query)
        );

        const start = this.currentPage() * this.pageSize();
        const end = start + this.pageSize();
        return filtered.slice(start, end);
    });

    async loadInventory() {
        try {
            const data = await this.inventoryService.getLowStockAlerts();
            this.inventory.set(data);
        } catch (error) {
            this.provideError(error);
        }
    }

    handleTableAction(event: TableActionEvent) {
        // Inventory might not have actions, but keeping handler just in case or if table requires it
        console.log('Action:', event);
    }

    handleSearch(term: string) {
        this.searchQuery.set(term);
        this.currentPage.set(0);
    }
}
