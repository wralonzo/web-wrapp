import { Product } from '../product/produt-response.interface';

export interface InventoryLoadRequest {
    productId: number;
    warehouseId: number;
    quantity: number;
    supplierId?: number;
    batchNumber?: string;
    expirationDate?: string;
    notes?: string;
}

export interface InventoryLoadBulkRequest {
    items: InventoryLoadRequest[];
    warehouseId?: number;
}

export interface InventoryLoadResponse {
    success: boolean;
    message: string;
    itemsProcessed: number;
    errors?: string[];
}
