import { Profile } from '@assets/retail-shop/Profile';
import { UserAuth } from '@assets/retail-shop/UserAuth';
import { HttpResponseApi, HttpResponseApiFindOne } from '../http/http-response';

export interface User {
  profile: Profile;
  user: UserAuth;
  employee: Employee | null;
  // Compatibility fields for some existing logic if needed
  id?: number;
  enabled?: boolean;
  roles?: string[];
}

export interface Employee {
  id: number;
  warehouseId: number;
  warehouseName?: string; // Optativo si viene del backend
  positionId: number;
  positionName: string;
}

export interface AuthResponse extends HttpResponseApiFindOne<User> {
  data: User;
}

export interface AuthResponseAll extends HttpResponseApi<User> { }
