import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';

@Component({
    selector: 'app-add-warehouse',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ButtonComponent,
        InputComponent,
        CheckboxComponent,
    ],
    templateUrl: './add-warehouse.component.html',
})
export class AddWarehouseComponent extends PageConfiguration {
    public loading = signal(false);
    public formSubmitted = signal(false);

    public warehouse = {
        name: '',
        code: '',
        phone: '',
        active: true,
        branchId: 1, // Defaulting to 1 as per example, ideally this would be a select
    };

    async register(form: NgForm) {
        this.formSubmitted.set(true);

        if (form.invalid) {
            this.toast.show('Por favor, completa todos los campos requeridos.', 'error');
            return;
        }

        this.loading.set(true);
        try {
            await this.rustService.call(async (bridge: GenericHttpBridge) => {
                return await bridge.post('/warehouse', this.warehouse);
            });
            this.toast.show('Almacén registrado exitosamente', 'success');
            this.nav.push(APP_ROUTES.nav.warehouses.list);
        } catch (error) {
            this.provideError(error);
        } finally {
            this.loading.set(false);
        }
    }
}
