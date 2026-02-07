import { Injectable } from '@angular/core';
import { PageConfiguration } from 'src/app/page-configurations';
import { Sale } from '@shared/models/inventory/sale.interface';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';

@Injectable({
    providedIn: 'root'
})
export class SaleService extends PageConfiguration {

    async getAll(): Promise<PaginatedResponse<Sale>> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get('/api/sales');
        });
    }

    async getById(id: number): Promise<Sale> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get(`/api/sales/${id}`);
        });
    }

    async create(sale: Sale): Promise<Sale> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.post('/api/sales', sale);
        });
    }

    async update(id: number, sale: Sale): Promise<Sale> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.put(`/api/sales/${id}`, sale);
        });
    }

    async delete(id: number): Promise<void> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.delete(`/api/sales/${id}`);
        });
    }
}
