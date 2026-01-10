import { inject } from '@angular/core';
import { HttpService } from '../http.service';
import {
  Category,
  CategoryResponse,
} from '@shared/models/category/category.interface';
import { CategoriesResponse } from '../../../shared/models/category/category.interface';

export class CategoryService {
  private readonly httpService = inject(HttpService);
  private readonly pathApi: string = 'category';

  public find(terms?: Record<string, string | number>) {
    return this.httpService.doGet<CategoriesResponse>(`${this.pathApi}`, terms);
  }

  public findOne(id: number) {
    return this.httpService.doGet<CategoryResponse>(`${this.pathApi}/${id}`);
  }

  public create(id: number) {
    return this.httpService.doGet<CategoryResponse>(`${this.pathApi}/${id}/user`);
  }

  public update(id: number, client: Category) {
    return this.httpService.doPatch<CategoryResponse>(`${this.pathApi}/${id}`, client);
  }

  public delete(id: number) {
    return this.httpService.doPatch<CategoryResponse>(`${this.pathApi}/${id}`, {});
  }
}
