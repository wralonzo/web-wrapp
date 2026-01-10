import { HttpResponseApi, HttpResponseApiFindOne } from '../http/http-response';

export interface Category {
  id: number;
  name: string;
  code: string;
  notes: string;
  createdAt: Date;
  updateAt: null;
  deletedAt: null;
}

export interface CategoryResponse extends HttpResponseApiFindOne<Category> {}
export interface CategoriesResponse extends HttpResponseApi<Category> {}
