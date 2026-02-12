export interface ReceptionItem {
    productId: number;
    quantity: number;
    batchNumber?: string;
    costPrice: number;
    expirationDate?: string;
}

export interface PurchaseReceptionRequest {
    branchId: number;
    warehouseId: number;
    supplierId: number;
    observation?: string;
    items: ReceptionItem[];
}

export interface PurchaseReceptionResponse {
    success: boolean;
    message: string;
    itemsProcessed?: number;
}
