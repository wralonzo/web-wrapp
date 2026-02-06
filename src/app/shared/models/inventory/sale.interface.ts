import { Client } from '../client/client.interface';
import { Warehouse } from '../warehouse/warehouse.interface';
import { Product } from '../product/produt-response.interface';

export enum SaleStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    TRANSFER = 'TRANSFER',
    OTHER = 'OTHER'
}

export interface SaleDetail {
    id?: number;
    saleId?: number;
    productId: number;
    product?: Product;
    quantity: number;
    price: number;
    discount?: number;
    total: number;
}

export interface Sale {
    id?: number;
    clientId: number;
    clientName?: string;
    client?: Client;
    warehouseId: number;
    warehouseName?: string;
    warehouse?: Warehouse;
    date: string;
    status: SaleStatus;
    paymentMethod: PaymentMethod;
    notes?: string;
    subtotal: number;
    tax: number;
    total: number;
    details: SaleDetail[];
    createdAt?: string;
    updatedAt?: string;
}
