import { HttpResponseApi, HttpResponseApiFindOne } from '../http/http-response';

// auth.model.ts
export interface User {
  id: number;
  user: string;
  name: string;
  role: string;
  token: string;
  fullName: string;
  username: string;
  phone: string;
  address: string;
  avatar: string | null;
  password: string | null;
  createdAt: string;
  updateAt: string | null;
  deletedAt: string | null;
  passwordInit?: string;
  employee?: Employee;
  roles?: string[];
  enabled?: boolean;
  clientId?: number;
}

export interface Employee {
  id: number;
  warehouseId: number;
  warehouseName: string;
  positionId: number;
  positionName: string;
}

export interface AuthResponse extends HttpResponseApiFindOne<User> {
  data: User;
}

export interface AuthResponseAll extends HttpResponseApi<User> {}
