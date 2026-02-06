import { Injectable } from '@angular/core';
import { PageConfiguration } from 'src/app/page-configurations';
import { Sale } from '@shared/models/inventory/sale.interface';

@Injectable({
    providedIn: 'root'
})
export class SaleService extends PageConfiguration {

    async getAll(): Promise<Sale[]> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get('/inventory/sales');
        });
    }

    async getById(id: number): Promise<Sale> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get(`/inventory/sales/${id}`);
        });
    }

    async create(sale: Sale): Promise<Sale> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.post('/inventory/sales', sale);
        });
    }

    async update(id: number, sale: Sale): Promise<Sale> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.put(`/inventory/sales/${id}`, sale);
        });
    }

    async delete(id: number): Promise<void> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.delete(`/inventory/sales/${id}`);
        });
    }
}
