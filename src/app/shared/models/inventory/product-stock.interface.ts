export interface ProductStock {
    almacenName: string;
    inventario: {
        productName: string;
        sku: string;
        warehouseName: string;
        currentStock: number;
        stockMinim: number | null;
        quantityReserved: number;
        quantityAvailable: number;
        status: string;
    };
}

export interface ProductStockResponse {
    success: boolean;
    message: string;
    data: ProductStock[];
    status: number;
    timestamp: string;
}
