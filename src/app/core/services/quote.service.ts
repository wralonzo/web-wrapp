import { Injectable } from '@angular/core';
import { PageConfiguration } from 'src/app/page-configurations';
import { Quote } from '@shared/models/inventory/quote.interface';

@Injectable({
    providedIn: 'root'
})
export class QuoteService extends PageConfiguration {

    async getAll(): Promise<Quote[]> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get('/inventory/quotes');
        });
    }

    async getById(id: number): Promise<Quote> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get(`/inventory/quotes/${id}`);
        });
    }

    async create(data: Quote): Promise<Quote> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.post('/inventory/quotes', data);
        });
    }

    async update(id: number, data: Quote): Promise<Quote> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.put(`/inventory/quotes/${id}`, data);
        });
    }

    async delete(id: number): Promise<void> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.delete(`/inventory/quotes/${id}`);
        });
    }
}
