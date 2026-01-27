import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { Supplier } from '@shared/models/supplier/supplier.interface';

@Component({
    selector: 'app-edit-supplier',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ButtonComponent,
        InputComponent,
    ],
    templateUrl: './edit-supplier.component.html',
})
export class EditSupplierComponent extends PageConfiguration implements OnInit {
    private route = inject(ActivatedRoute);

    public loading = signal(false);
    public fetching = signal(false);
    public formSubmitted = signal(false);

    public supplier: Supplier = {
        id: 0,
        name: '',
        companyName: '',
        address: '',
        email: '',
        phone: '',
    };

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchSupplier(id);
        }
    }

    async fetchSupplier(id: string) {
        this.fetching.set(true);
        try {
            const response: Supplier = await this.rustService.call(async (bridge: GenericHttpBridge) => {
                return await bridge.get(`/supplier/${id}`);
            });
            this.supplier = response;
        } catch (error) {
            this.provideError(error);
            this.nav.push(APP_ROUTES.nav.suppliers.list);
        } finally {
            this.fetching.set(false);
        }
    }

    async update(form: NgForm) {
        this.formSubmitted.set(true);

        if (form.invalid) {
            this.toast.show('Por favor, completa todos los campos requeridos.', 'error');
            return;
        }

        this.loading.set(true);
        try {
            await this.rustService.call(async (bridge: GenericHttpBridge) => {
                return await bridge.patch(`/supplier/${this.supplier.id}`, this.supplier);
            });
            this.toast.show('Proveedor actualizado exitosamente', 'success');
            this.nav.push(APP_ROUTES.nav.suppliers.list);
        } catch (error) {
            this.provideError(error);
        } finally {
            this.loading.set(false);
        }
    }
}
