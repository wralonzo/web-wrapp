import { inject } from '@angular/core';
import { HttpService } from '../http.service';
import {
  Supplier,
  SupplierResponse,
  SuppliersResponse,
} from '@shared/models/supplier/supplier.interface';

export class SupplierService {
  private readonly httpService = inject(HttpService);
  private readonly pathApi: string = 'supplier';

  public find(terms?: Record<string, string | number>) {
    return this.httpService.doGet<SuppliersResponse>(`${this.pathApi}`, terms);
  }

  public findOne(id: number) {
    return this.httpService.doGet<SupplierResponse>(`${this.pathApi}/${id}`);
  }

  public create(payload: Supplier) {
    return this.httpService.doPost<SupplierResponse>(`${this.pathApi}`, payload);
  }

  public update(id: number, client: Supplier) {
    return this.httpService.doPatch<SupplierResponse>(`${this.pathApi}/${id}`, client);
  }

  public delete(id: number) {
    return this.httpService.doPatch<SupplierResponse>(`${this.pathApi}/${id}/delete`, {});
  }
}
