import { Injectable } from '@angular/core';
import { PageConfiguration } from 'src/app/page-configurations';
import { ProductBundle } from '@shared/models/inventory/product-bundle.interface';
import { ProductBundleResponse } from '@shared/models/product/produt-response.interface';

@Injectable({
    providedIn: 'root'
})
export class ProductBundleService extends PageConfiguration {
    private readonly pathApi = 'bundles';

    async getAll(): Promise<ProductBundle[]> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get(this.pathApi);
        });
    }

    async getAllProduct(idProduct: number): Promise<ProductBundleResponse[]> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get(`${this.pathApi}/products/${idProduct}`);
        });
    }

    async getById(id: number): Promise<ProductBundle> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get(`${this.pathApi}/${id}`);
        });
    }

    async create(idProduct: number, data: { childProductId: number, quantity: number }): Promise<ProductBundle> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.post(`${this.pathApi}/${idProduct}`, data);
        });
    }

    async update(id: number, data: {}): Promise<ProductBundle> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.put(`${this.pathApi}/${id}`, data);
        });
    }

    async delete(id: number): Promise<void> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.delete(`${this.pathApi}/${id}`);
        });
    }

    async list(productId: number): Promise<any> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get(`${this.pathApi}/products/${productId}`);
        });
    }
}
