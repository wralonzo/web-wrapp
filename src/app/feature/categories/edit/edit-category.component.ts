import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { Category } from '@shared/models/category/category.interface';

@Component({
    selector: 'app-edit-category',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ButtonComponent,
        InputComponent,
    ],
    templateUrl: './edit-category.component.html',
})
export class EditCategoryComponent extends PageConfiguration implements OnInit {
    private route = inject(ActivatedRoute);

    public loading = signal(false);
    public fetching = signal(false);
    public formSubmitted = signal(false);

    public category: Category = {
        id: 0,
        name: '',
        code: '',
        notes: '',
        createdAt: new Date(),
        updateAt: null,
        deletedAt: null
    };

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchCategory(id);
        }
    }

    async fetchCategory(id: string) {
        this.fetching.set(true);
        try {
            const response: Category = await this.rustService.call(async (bridge: GenericHttpBridge) => {
                return await bridge.get(`/category/${id}`);
            });
            this.category = response;
        } catch (error) {
            this.provideError(error);
            this.nav.push(APP_ROUTES.nav.categories.list);
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
                return await bridge.patch(`/category/${this.category.id}`, this.category);
            });
            this.toast.show('Categoría actualizada exitosamente', 'success');
            this.nav.push(APP_ROUTES.nav.categories.list);
        } catch (error) {
            this.provideError(error);
        } finally {
            this.loading.set(false);
        }
    }
}
