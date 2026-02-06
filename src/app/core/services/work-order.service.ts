import { Injectable } from '@angular/core';
import { PageConfiguration } from 'src/app/page-configurations';
import { WorkOrder } from '@shared/models/inventory/work-order.interface';

@Injectable({
    providedIn: 'root'
})
export class WorkOrderService extends PageConfiguration {

    async getAll(): Promise<WorkOrder[]> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get('/inventory/work-orders');
        });
    }

    async getById(id: number): Promise<WorkOrder> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.get(`/inventory/work-orders/${id}`);
        });
    }

    async create(data: WorkOrder): Promise<WorkOrder> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.post('/inventory/work-orders', data);
        });
    }

    async update(id: number, data: WorkOrder): Promise<WorkOrder> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.put(`/inventory/work-orders/${id}`, data);
        });
    }

    async delete(id: number): Promise<void> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.delete(`/inventory/work-orders/${id}`);
        });
    }
}
