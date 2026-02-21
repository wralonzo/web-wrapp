import { Component, EventEmitter, inject, OnInit, Output, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Product } from '@shared/models/product/produt-response.interface';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError, map } from 'rxjs/operators';
import { from, Subscription } from 'rxjs';
import { PageConfiguration } from 'src/app/page-configurations';

@Component({
    selector: 'app-product-search',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './product-search.component.html',
    styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent extends PageConfiguration implements OnInit, OnDestroy {
    @Output() onProductSelect = new EventEmitter<Product>();

    searchControl = new FormControl('', { nonNullable: true });
    products: Product[] = [];
    isLoading = signal(false);
    hasSearched = signal(false);
    showDropdown = signal(false);
    activeIndex = signal(-1);

    private subscription!: Subscription;

    ngOnInit(): void {
        this.subscription = this.searchControl.valueChanges
            .pipe(
                map(value => (typeof value === 'string' ? value.trim() : '')),
                filter(value => {
                    if (value.length < 3) {
                        this.products = [];
                        this.showDropdown.set(false);
                        this.hasSearched.set(false);
                        return false;
                    }
                    return true;
                }),
                debounceTime(300),
                distinctUntilChanged(),
                switchMap(query => {
                    this.isLoading.set(true);
                    this.hasSearched.set(true);
                    // Solicitud optimizada limitando resultados (Fase 1)
                    const dataPromise = this.rustService.call((bridge) => {
                        return bridge.get(`/products/search?term=${query}`);
                    });
                    return from(dataPromise).pipe(
                        catchError((err) => {
                            console.error(err);
                            return from([{ data: { content: [] } }]);
                        })
                    );
                })
            )
            .subscribe((res: any) => {
                this.isLoading.set(false);
                // Adaptación al formato de respuesta base paginada
                this.products = res?.data?.content || res?.content || res || [];
                this.showDropdown.set(true);
                this.activeIndex.set(-1);
            });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    selectProduct(product: Product) {
        this.onProductSelect.emit(product);
        this.searchControl.setValue(product.name, { emitEvent: false });
        this.showDropdown.set(false);
    }

    onKeyDown(event: KeyboardEvent) {
        if (!this.showDropdown() || this.products.length === 0) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.activeIndex.set((this.activeIndex() + 1) % this.products.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.activeIndex.set((this.activeIndex() - 1 + this.products.length) % this.products.length);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (this.activeIndex() >= 0 && this.activeIndex() < this.products.length) {
                this.selectProduct(this.products[this.activeIndex()]);
            }
        } else if (event.key === 'Escape') {
            this.showDropdown.set(false);
        }
    }

    hideDropdown() {
        // Retraso para evitar que el dropdown desaparezca antes de procesar el clic (selectProduct)
        setTimeout(() => {
            this.showDropdown.set(false);
        }, 200);
    }

    onInputFocus() {
        if (this.products.length > 0) {
            this.showDropdown.set(true);
        }
    }
}
