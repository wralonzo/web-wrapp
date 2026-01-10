import { HttpResponseApi, HttpResponseApiFindOne } from '../http/http-response';
export interface Supplier {
  name: string;
  id?: number;
  address: string;
  email: string;
  phone: string;
  companyName: string;
}

export interface SupplierResponse extends HttpResponseApiFindOne<Supplier> {}
export interface SuppliersResponse extends HttpResponseApi<Supplier> {}
