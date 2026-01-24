import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { Role } from '@shared/models/role/role.interface';

@Component({
    selector: 'app-edit-role',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ButtonComponent,
        InputComponent,
    ],
    templateUrl: './edit-role.component.html',
})
export class EditRoleComponent extends PageConfiguration implements OnInit {
    private route = inject(ActivatedRoute);

    public loading = signal(false);
    public fetching = signal(false);
    public formSubmitted = signal(false);

    public role: Role = {
        id: 0,
        name: '',
        note: '',
    };

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchRole(id);
        }
    }

    async fetchRole(id: string) {
        this.fetching.set(true);
        try {
            const response: Role = await this.rustService.call(async (bridge: GenericHttpBridge) => {
                return await bridge.get(`/role/${id}`);
            });
            this.role = response;
        } catch (error) {
            this.provideError(error);
            this.nav.push(APP_ROUTES.nav.roles.list);
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
                // Using patch/put as per patterns observed
                return await bridge.patch(`/role/${this.role.id}`, this.role);
            });
            this.toast.show('Rol actualizado exitosamente', 'success');
            this.nav.push(APP_ROUTES.nav.roles.list);
        } catch (error) {
            this.provideError(error);
        } finally {
            this.loading.set(false);
        }
    }
}
