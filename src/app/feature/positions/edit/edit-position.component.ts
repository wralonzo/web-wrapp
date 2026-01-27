import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { PositionType } from '@shared/models/position-type/position-type.interface';

@Component({
    selector: 'app-edit-position',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ButtonComponent,
        InputComponent,
    ],
    templateUrl: './edit-position.component.html',
})
export class EditPositionComponent extends PageConfiguration implements OnInit {
    private route = inject(ActivatedRoute);

    public loading = signal(false);
    public fetching = signal(false);
    public formSubmitted = signal(false);

    public position: PositionType = {
        id: 0,
        name: '',
        level: 1,
    };

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchPosition(id);
        }
    }

    async fetchPosition(id: string) {
        this.fetching.set(true);
        try {
            const response: PositionType = await this.rustService.call(async (bridge: GenericHttpBridge) => {
                return await bridge.get(`/position-type/${id}`);
            });
            this.position = response;
        } catch (error) {
            this.provideError(error);
            this.nav.push(APP_ROUTES.nav.positions.list);
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
                return await bridge.patch(`/position-type/${this.position.id}`, this.position);
            });
            this.toast.show('Puesto actualizado exitosamente', 'success');
            this.nav.push(APP_ROUTES.nav.positions.list);
        } catch (error) {
            this.provideError(error);
        } finally {
            this.loading.set(false);
        }
    }
}
