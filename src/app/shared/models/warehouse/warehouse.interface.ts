import { HttpResponseApi, HttpResponseApiFindOne } from '../http/http-response';

export interface Warehouse {
  name: string;
  id: number;
  code: string;
  active: boolean;
  phone: string;
  branchId: number;
  // Optionals if needed by UI but not in initial payload
  address?: string;
  notes?: string;
  boss?: string;
}

export interface WarehouseResponse extends HttpResponseApi<Warehouse> { }
export interface WarehouseResponseFindOne extends HttpResponseApiFindOne<Warehouse> { }
