import { Injectable } from '@angular/core';
import { PageConfiguration } from 'src/app/page-configurations';
import { ProductUnit } from '@shared/models/product-unit/product-unit.interface';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';

@Injectable({
    providedIn: 'root'
})
export class ProductUnitService extends PageConfiguration {

    async getAll(): Promise<any> {
        return await this.rustService.call(async (bridge) => {
            // Assuming existing backend pattern or mocking for now if endpoint doesn't exist
            return await bridge.get('/inventory/product-units');
        });
    }

    async getById(id: string): Promise<ProductUnit> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get(`/inventory/product-units/${id}`);
        });
    }

    async create(data: ProductUnit): Promise<ProductUnit> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.post('/inventory/product-units', data);
        });
    }

    async update(id: string, data: ProductUnit): Promise<ProductUnit> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.patch(`/inventory/product-units/${id}`, data);
        });
    }

    async delete(id: string): Promise<void> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.delete(`/inventory/product-units/${id}`);
        });
    }
}
