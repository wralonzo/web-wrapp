import { Injectable } from '@angular/core';
import { PageConfiguration } from 'src/app/page-configurations';
import { ProductBundle } from '@shared/models/inventory/product-bundle.interface';

@Injectable({
    providedIn: 'root'
})
export class ProductBundleService extends PageConfiguration {

    async getAll(): Promise<ProductBundle[]> {
        return await this.rustService.call(async (bridge) => {
            // Using the inventory prefix as observed in recent changes
            return await bridge.get('/inventory/product-bundles');
        });
    }

    async getById(id: number): Promise<ProductBundle> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get(`/inventory/product-bundles/${id}`);
        });
    }

    async create(data: ProductBundle): Promise<ProductBundle> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.post('/inventory/product-bundles', data);
        });
    }

    async update(id: number, data: ProductBundle): Promise<ProductBundle> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.put(`/inventory/product-bundles/${id}`, data);
        });
    }

    async delete(id: number): Promise<void> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.delete(`/inventory/product-bundles/${id}`);
        });
    }
}
