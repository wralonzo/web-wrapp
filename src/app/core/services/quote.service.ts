import { Injectable } from '@angular/core';
import { PageConfiguration } from 'src/app/page-configurations';
import { Quote } from '@shared/models/inventory/quote.interface';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';

@Injectable({
    providedIn: 'root'
})
export class QuoteService extends PageConfiguration {

    async getAll(): Promise<PaginatedResponse<Quote>> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get('/quotes');
        });
    }

    async getById(id: number): Promise<Quote> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get(`/quotes/${id}`);
        });
    }

    async create(data: Quote): Promise<Quote> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.post('/quotes', data);
        });
    }

    async update(id: number, data: Quote): Promise<Quote> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.put(`/quotes/${id}`, data);
        });
    }

    async delete(id: number): Promise<void> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.delete(`/quotes/${id}`);
        });
    }
}
