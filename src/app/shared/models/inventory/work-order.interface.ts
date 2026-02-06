export enum WorkOrderStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface WorkOrderDetail {
    id?: number;
    workOrderId?: number;
    productId: number;
    productName?: string;
    quantity: number;
    price: number;
    discount: number;
    taxes: number;
    total: number;
}

export interface WorkOrder {
    id?: number;
    referenceNumber?: string;
    name: string;
    prefix: string;
    description: string;

    clientId: number;
    clientName?: string;
    warehouseId: number;
    warehouseName?: string;
    userId: number;

    status: WorkOrderStatus;
    notes?: string;

    createdAt?: string;

    details?: WorkOrderDetail[];
}
