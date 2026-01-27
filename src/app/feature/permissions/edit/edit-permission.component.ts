import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { Permission } from '@shared/models/permission/permission.interface';

@Component({
    selector: 'app-edit-permission',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ButtonComponent,
        InputComponent,
    ],
    templateUrl: './edit-permission.component.html',
})
export class EditPermissionComponent extends PageConfiguration implements OnInit {
    private route = inject(ActivatedRoute);

    public loading = signal(false);
    public fetching = signal(false);
    public formSubmitted = signal(false);

    public permission: Permission = {
        id: 0,
        name: '',
        description: '',
    };

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchPermission(id);
        }
    }

    async fetchPermission(id: string) {
        this.fetching.set(true);
        try {
            const response: Permission = await this.rustService.call(async (bridge: GenericHttpBridge) => {
                return await bridge.get(`/permission/${id}`);
            });
            this.permission = response;
        } catch (error) {
            this.provideError(error);
            this.nav.push(APP_ROUTES.nav.permissions.list);
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
                return await bridge.patch(`/permission/${this.permission.id}`, this.permission);
            });
            this.toast.show('Permiso actualizado exitosamente', 'success');
            this.nav.push(APP_ROUTES.nav.permissions.list);
        } catch (error) {
            this.provideError(error);
        } finally {
            this.loading.set(false);
        }
    }
}
