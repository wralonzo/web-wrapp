import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '@shared/models/field/field-config.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { ReservationService } from '@core/services/reservation.service';
import { ProductService } from '@core/services/product.service';

interface ReservationItem {
  productId: number;
  unitId: number;
  quantity: number;
  productName?: string;
  unitName?: string;
}

@Component({
  selector: 'app-add',
  imports: [CommonModule, DynamicFormComponent, FormsModule],
  templateUrl: './add-reservation.component.html',
  styleUrl: './add-reservation.component.scss',
  providers: [ReservationService, ProductService]
})
export class AddReservationComponent extends PageConfiguration {
  private reservationService = inject(ReservationService);
  private productService = inject(ProductService);

  public items = signal<ReservationItem[]>([]);
  public availableProducts = signal<any[]>([]);

  public fields = signal<FieldConfig<any>[]>([
    {
      name: 'clientId',
      label: 'Cliente',
      type: 'select',
      required: true,
      colSpan: 1,
      endpoint: '/client',
      mapResponse: (r: any) => (r.data || r).map((c: any) => ({ label: `${c.name} ${c.lastName || ''}`, value: c.id }))
    },
    {
      name: 'warehouseId',
      label: 'Sucursal / Local',
      type: 'select',
      required: true,
      colSpan: 1,
      endpoint: '/warehouse',
      mapResponse: (r: any) => (r.data || r).map((w: any) => ({ label: w.name, value: w.id }))
    },
    {
      name: 'reservationDate',
      label: 'Fecha de la Cita',
      type: 'date',
      required: true,
      colSpan: 1,
    },
    {
      name: 'expirationDate',
      label: 'Fecha de Expiración (Opcional)',
      type: 'date',
      required: false,
      colSpan: 1,
    },
    {
      name: 'notes',
      label: 'Notas o preferencias especiales',
      type: 'text',
      colSpan: 2,
      required: false,
    },
  ]);

  headerFormValue: any = {};

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    try {
      const res = await this.productService.find({ pageSize: 1000 });
      this.availableProducts.set(res?.data?.content || []);
    } catch (error) {
      this.provideError(error);
    }
  }

  addItem() {
    this.items.update(curr => [
      ...curr,
      { productId: 0, unitId: 0, quantity: 1 }
    ]);
  }

  removeItem(index: number) {
    this.items.update(curr => curr.filter((_, i) => i !== index));
  }

  getProductUnits(productId: number): any[] {
    if (!productId) return [];
    const p = this.availableProducts().find(prod => prod.id == productId);
    return p?.units || [];
  }

  setHeaderData(formData: any) {
    this.headerFormValue = formData;
  }

  async handleSave(formData: any) {
    if (this.items().length === 0) {
      this.toast.show('Debe agregar al menos un item a la reservación.', 'error');
      return;
    }

    // Verify items are complete
    const invalidItems = this.items().filter(i => !i.productId || !i.unitId || i.quantity <= 0);
    if (invalidItems.length > 0) {
      this.toast.show('Todos los items deben tener un producto, unidad y cantidad válida.', 'error');
      return;
    }

    try {
      const payload = {
        clientId: Number(formData.clientId),
        warehouseId: Number(formData.warehouseId),
        reservationDate: formData.reservationDate,
        expirationDate: formData.expirationDate || null,
        notes: formData.notes,
        items: this.items().map(item => ({
          productId: Number(item.productId),
          unitId: Number(item.unitId),
          quantity: Number(item.quantity)
        }))
      };

      await this.reservationService.createReservation(payload).toPromise();
      this.toast.show('Reservación creada exitosamente', 'success');
      this.nav.pop();
    } catch (error) {
      this.provideError(error);
    }
  }
}
