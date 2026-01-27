import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';

@Component({
    selector: 'app-add-permission',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ButtonComponent,
        InputComponent,
    ],
    templateUrl: './add-permission.component.html',
})
export class AddPermissionComponent extends PageConfiguration {
    public loading = signal(false);
    public formSubmitted = signal(false);

    public permission = {
        name: '',
        description: '',
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
                return await bridge.post('/permission', this.permission);
            });
            this.toast.show('Permiso registrado exitosamente', 'success');
            this.nav.push(APP_ROUTES.nav.permissions.list);
        } catch (error) {
            this.provideError(error);
        } finally {
            this.loading.set(false);
        }
    }
}
