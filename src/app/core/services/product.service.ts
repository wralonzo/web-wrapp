import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import {
  Product,
  ProductResponse,
  ProductsResponse,
} from '@shared/models/product/produt-response.interface';
import { ImportProductResponse } from '@shared/models/product/response-import.interface';
import { PageConfiguration } from 'src/app/page-configurations';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends PageConfiguration {
  private readonly pathApi = 'products';
  private readonly pathApiFile = 'batch/products';

  public find(params?: Record<string, string | number>) {
    return this.rustService.call(async (bridge) => {
      return await bridge.get(`${this.pathApi}`, params);
    });
  }

  public findById(id: number) {
    return this.rustService.call(async (bridge) => {
      return await bridge.get(`${this.pathApi}/${id}`);
    });
  }

  public create(product: Product) {
    return this.rustService.call(async (bridge) => {
      return await bridge.post(`${this.pathApi}`, product);
    });
  }

  public update(id: number, product: Product) {
    return this.rustService.call(async (bridge) => {
      return await bridge.patch(`${this.pathApi}/${id}`, product);
    });
  }

  public delete(id: number) {
    return this.rustService.call(async (bridge) => {
      return await bridge.delete(`${this.pathApi}/${id}`);
    });
  }

  public deactive(id: number) {
    return this.rustService.call(async (bridge) => {
      return await bridge.get(`${this.pathApi}/deactive/${id}`);
    });
  }

  public activate(id: number) {
    return this.rustService.call(async (bridge) => {
      return await bridge.get(`${this.pathApi}/activate/${id}`);
    });
  }

  public downloadTemplateExcel() {
    return this.rustService.call(async (bridge) => {
      return await bridge.get(`${this.pathApiFile}/template`);
    });
  }

  public importProducts(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.rustService.call(async (bridge) => {
      return await bridge.post(`${this.pathApiFile}/import`, formData);
    });
  }

  public findAvailableProducts(term: string): Promise<ProductsResponse> {
    return this.rustService.call(async (bridge) => {
      return await bridge.get(`${this.pathApi}/search?term=${term}`);
    });
  }
}
