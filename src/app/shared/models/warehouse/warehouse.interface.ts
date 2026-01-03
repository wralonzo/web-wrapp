import { HttpResponseApi, HttpResponseApiFindOne } from '../http/http-response';

export interface Warehouse {
  name: string;
  id: number;
  address: string;
  boss: string;
  code: string;
  phone: string;
  notes: string;
}

export interface WarehouseResponse extends HttpResponseApi<Warehouse> {}
export interface WarehouseResponseFindOne extends HttpResponseApiFindOne<Warehouse> {}
