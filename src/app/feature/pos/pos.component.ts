import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageConfiguration } from 'src/app/page-configurations';
import { PosCartService } from './pos-cart.service';
import { Product } from '@shared/models/product/produt-response.interface';
import { SaleService } from '@core/services/sale.service';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
    selector: 'app-pos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './pos.component.html',
    styleUrls: ['./pos.component.scss']
})
export class PosComponent extends PageConfiguration implements OnInit {
    public products = signal<Product[]>([]);
    public filteredProducts = signal<Product[]>([]);
    public searchQuery = signal('');
    public selectedClient = signal<number | null>(null);
    public selectedWarehouse = signal<number | null>(null);
    public isProcessing = signal(false);

    constructor(
        public cartService: PosCartService,
        private saleService: SaleService
    ) {
        super();
    }

    async ngOnInit() {
        await this.loadProducts();
    }

    async loadProducts() {
        try {
            const response = await this.rustService.call(async (bridge) => {
                return await bridge.get('/products?size=100');
            });

            const productList = response.content || response.data || response;
            this.products.set(productList);
            this.filteredProducts.set(productList);
        } catch (error) {
            this.provideError(error);
        }
    }

    onSearchChange(query: string) {
        this.searchQuery.set(query);
        const lowerQuery = query.toLowerCase();

        if (!lowerQuery) {
            this.filteredProducts.set(this.products());
            return;
        }

        const filtered = this.products().filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.sku?.toLowerCase().includes(lowerQuery) ||
            p.barcode?.toLowerCase().includes(lowerQuery)
        );

        this.filteredProducts.set(filtered);
    }

    addToCart(product: Product) {
        this.cartService.addProduct(product, product.priceSale);
    }

    async processPayment() {
        if (!this.selectedClient() || !this.selectedWarehouse()) {
            this.toast.show('Seleccione cliente y almacén', 'warning');
            return;
        }

        if (this.cartService.cartItems().length === 0) {
            this.toast.show('El carrito está vacío', 'warning');
            return;
        }

        this.isProcessing.set(true);

        try {
            const payload = this.cartService.getCartPayload(
                this.selectedClient()!,
                this.selectedWarehouse()!
            );

            await this.saleService.create(payload as any);
            this.toast.show('Venta procesada exitosamente', 'success');
            this.cartService.clearCart();
            this.selectedClient.set(null);
            this.selectedWarehouse.set(null);
        } catch (error) {
            this.provideError(error);
        } finally {
            this.isProcessing.set(false);
        }
    }

    updateQuantity(productId: number, quantity: number) {
        this.cartService.updateQuantity(productId, quantity);
    }

    removeFromCart(productId: number) {
        this.cartService.removeProduct(productId);
    }
}
