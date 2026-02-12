import { Injectable } from '@angular/core';
import { PageConfiguration } from 'src/app/page-configurations';
import { Inventory } from '@shared/models/inventory/inventory.interface';

@Injectable({
    providedIn: 'root'
})
export class InventoryService extends PageConfiguration {

    async getStock(): Promise<Inventory[]> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get('/inventory/stock');
        });
    }

    async getLowStockAlerts(): Promise<Inventory[]> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get('/inventory/low-stock');
        });
    }

    async loadInventory(request: import('./../../shared/models/inventory/inventory-load.interface').InventoryLoadRequest): Promise<import('./../../shared/models/inventory/inventory-load.interface').InventoryLoadResponse> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.post('/inventory/load', request);
        });
    }

    async loadInventoryBulk(request: import('./../../shared/models/inventory/inventory-load.interface').InventoryLoadBulkRequest): Promise<import('./../../shared/models/inventory/inventory-load.interface').InventoryLoadResponse> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.post('/inventory/load/bulk', request);
        });
    }

    async loadInventoryFromExcel(file: File, warehouseId?: number): Promise<import('./../../shared/models/inventory/inventory-load.interface').InventoryLoadResponse> {
        return await this.rustService.call(async (bridge) => {
            const formData = new FormData();
            formData.append('file', file);
            if (warehouseId) {
                formData.append('warehouseId', warehouseId.toString());
            }
            return await bridge.postFormData('/inventory/load/excel', formData);
        });
    }
}
