import { Client } from '../client/client.interface';
import { Warehouse } from '../warehouse/warehouse.interface';
import { Product } from '../product/produt-response.interface';

export enum SaleStatus {
    COMPLETADA = 'COMPLETADA',
    CANCELADA = 'CANCELADA',
    PENDIENTE = 'PENDIENTE'
}

export enum PaymentMethod {
    CONTADO = 'CONTADO',
    CREDITO = 'CREDITO'
}

export interface SaleDetail {
    id?: number;
    saleId?: number;
    productId: number;
    product?: Product;
    productName?: string;
    unitId: number;
    unitName?: string;
    quantity: number;
    price: number;
    priceUnit?: number; // Backend response
    discount?: number;
    total?: number; // Frontend calc helper
    subtotal?: number; // Backend response
}

export interface Sale {
    id?: number;
    prefix?: string;
    clientId: number;
    clientName?: string;
    client?: Client;
    warehouseId: number;
    warehouseName?: string;
    warehouse?: Warehouse;

    // Matched with backend SaleRequest/Response
    type: PaymentMethod;
    state?: SaleStatus; // 'status' in frontend form config, but 'state' in backend response

    date?: string; // Frontend form 'date'
    saleDate?: string; // Backend 'saleDate'

    notes?: string;
    subtotal: number;
    // tax: number; // Backend doesn't have tax explicit field yet in Request, but response does. 
    // Request just has total? No, Request has items. Backend calcs totals.
    // Frontend should send items and let backend calc, or send totals if supported.
    // SaleService creates sale calculating totals.

    taxes?: number;
    discount?: number;
    total: number;

    // Frontend form uses 'items' for creating
    items?: {
        productId: number;
        unitId: number;
        quantity: number;
        discount?: number;
    }[];

    details?: SaleDetail[]; // For response

    createdAt?: string;
    updatedAt?: string;
}
