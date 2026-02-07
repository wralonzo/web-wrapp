import { Injectable } from '@angular/core';
import { PageConfiguration } from 'src/app/page-configurations';
import { WorkOrder } from '@shared/models/inventory/work-order.interface';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';

@Injectable({
    providedIn: 'root'
})
export class WorkOrderService extends PageConfiguration {

    async getAll(): Promise<PaginatedResponse<WorkOrder>> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get('work-orders');
        });
    }

    async getById(id: number): Promise<WorkOrder> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get(`/work-orders/${id}`);
        });
    }

    async create(data: WorkOrder): Promise<WorkOrder> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.post('/work-orders', data);
        });
    }

    async update(id: number, data: WorkOrder): Promise<WorkOrder> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.put(`/work-orders/${id}`, data);
        });
    }

    async delete(id: number): Promise<void> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.delete(`/work-orders/${id}`);
        });
    }
}
