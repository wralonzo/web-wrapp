import { Injectable, signal, computed } from '@angular/core';
import { Product } from '@shared/models/product/produt-response.interface';

export interface CartItem {
    product: Product;
    quantity: number;
    unitPrice: number;
    discount: number;
    subtotal: number;
}

@Injectable({
    providedIn: 'root'
})
export class PosCartService {
    private items = signal<CartItem[]>([]);

    public cartItems = this.items.asReadonly();

    public totals = computed(() => {
        const items = this.items();
        let subtotal = 0;
        let discount = 0;

        items.forEach(item => {
            subtotal += item.quantity * item.unitPrice;
            discount += item.discount || 0;
        });

        const total = subtotal - discount;

        return {
            subtotal,
            discount,
            total,
            itemCount: items.reduce((acc, item) => acc + item.quantity, 0)
        };
    });

    addProduct(product: Product, unitPrice: number = 0) {
        const existingIndex = this.items().findIndex(i => i.product.id === product.id);

        if (existingIndex >= 0) {
            // Update quantity
            this.items.update(items => {
                const updated = [...items];
                updated[existingIndex].quantity += 1;
                updated[existingIndex].subtotal = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
                return updated;
            });
        } else {
            // Add new item
            const newItem: CartItem = {
                product,
                quantity: 1,
                unitPrice: unitPrice || product.priceSale || 0,
                discount: 0,
                subtotal: unitPrice || product.priceSale || 0
            };
            this.items.update(items => [...items, newItem]);
        }
    }

    updateQuantity(productId: number, quantity: number) {
        if (quantity <= 0) {
            this.removeProduct(productId);
            return;
        }

        this.items.update(items => {
            return items.map(item => {
                if (item.product.id === productId) {
                    return {
                        ...item,
                        quantity,
                        subtotal: quantity * item.unitPrice - item.discount
                    };
                }
                return item;
            });
        });
    }

    updateDiscount(productId: number, discount: number) {
        this.items.update(items => {
            return items.map(item => {
                if (item.product.id === productId) {
                    return {
                        ...item,
                        discount,
                        subtotal: item.quantity * item.unitPrice - discount
                    };
                }
                return item;
            });
        });
    }

    removeProduct(productId: number) {
        this.items.update(items => items.filter(i => i.product.id !== productId));
    }

    clearCart() {
        this.items.set([]);
    }

    getCartPayload(clientId: number, warehouseId: number) {
        return {
            clientId,
            warehouseId,
            type: 'CONTADO' as const,
            notes: '',
            items: this.items().map(item => ({
                productId: item.product.id!,
                unitId: 1, // Default unit - should be configurable
                quantity: item.quantity,
                discount: item.discount
            }))
        };
    }
}
