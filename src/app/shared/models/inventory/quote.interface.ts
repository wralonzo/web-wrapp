export enum QuoteStatus {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED'
}

export interface QuoteDetail {
    id?: number;
    quoteId?: number;
    productId: number;
    productName?: string; // Optional for display
    quantity: number;
    price: number;
    discount: number;
    taxes: number;
    total: number;
}

export interface Quote {
    id?: number;
    referenceNumber?: string;
    name: string; // Header title/name
    prefix: string;
    description: string;

    clientId: number;
    clientName?: string;
    warehouseId: number;
    warehouseName?: string;
    userId?: number; // Creator

    status: QuoteStatus;
    notes?: string;
    dateExpired: string; // YYYY-MM-DD

    amount: number; // Subtotal
    discount: number;
    taxes: number;
    total: number;

    details: QuoteDetail[];

    createdAt?: string;
}
