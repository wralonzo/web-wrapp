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
}
