import { Product } from '../product/produt-response.interface';

export interface Inventory {
    id: number;
    product?: Product;
    productId?: number;
    warehouseId: number;
    quantity: number;
    alertQuantity: number;
    quantityReserved: number;
    quantityFree?: number;
    expirationDate?: string;
    createdAt?: string;
}
