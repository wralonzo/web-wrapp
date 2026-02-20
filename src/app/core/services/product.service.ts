import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import {
  Product,
  ProductResponse,
  ProductsResponse,
} from '@shared/models/product/produt-response.interface';
import { ImportProductResponse } from '@shared/models/product/response-import.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly api = inject(HttpService);
  private readonly pathApi = 'products';
  private readonly pathApiFile = 'batch/products';

  public find(params?: Record<string, string | number>) {
    return this.api.doGet<ProductsResponse>(`${this.pathApi}`, params);
  }

  public findById(id: number) {
    return this.api.doGet<ProductResponse>(`${this.pathApi}/${id}`);
  }

  public create(product: Product) {
    return this.api.doPost<ProductResponse>(`${this.pathApi}`, product);
  }

  public update(id: number, product: Product) {
    return this.api.doPatch<ProductResponse>(`${this.pathApi}/${id}`, product);
  }

  public delete(id: number) {
    return this.api.doDelete<void>(`${this.pathApi}/${id}`);
  }

  public deactive(id: number) {
    return this.api.doGet<ProductResponse>(`${this.pathApi}/deactive/${id}`);
  }

  public activate(id: number) {
    return this.api.doGet<ProductResponse>(`${this.pathApi}/activate/${id}`);
  }

  public downloadTemplateExcel() {
    return this.api.doGetFile(`${this.pathApiFile}/template`);
  }

  public importProducts(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.api.doPost<ImportProductResponse>(`${this.pathApiFile}/import`, formData);
  }
}
