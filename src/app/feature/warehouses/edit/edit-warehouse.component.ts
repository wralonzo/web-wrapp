import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { Warehouse } from '@shared/models/warehouse/warehouse.interface';

@Component({
    selector: 'app-edit-warehouse',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ButtonComponent,
        InputComponent,
        CheckboxComponent,
    ],
    templateUrl: './edit-warehouse.component.html',
})
export class EditWarehouseComponent extends PageConfiguration implements OnInit {
    private route = inject(ActivatedRoute);

    public loading = signal(false);
    public fetching = signal(false);
    public formSubmitted = signal(false);

    public warehouse: Warehouse = {
        id: 0,
        name: '',
        code: '',
        phone: '',
        active: true,
        branchId: 1,
    };

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchWarehouse(id);
        }
    }

    async fetchWarehouse(id: string) {
        this.fetching.set(true);
        try {
            const response: Warehouse = await this.rustService.call(async (bridge: GenericHttpBridge) => {
                return await bridge.get(`/warehouse/${id}`);
            });
            this.warehouse = response;
        } catch (error) {
            this.provideError(error);
            this.nav.push(APP_ROUTES.nav.warehouses.list);
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
                return await bridge.patch(`/warehouse/${this.warehouse.id}`, this.warehouse);
            });
            this.toast.show('Almacén actualizado exitosamente', 'success');
            this.nav.push(APP_ROUTES.nav.warehouses.list);
        } catch (error) {
            this.provideError(error);
        } finally {
            this.loading.set(false);
        }
    }
}
