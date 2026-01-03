import { HttpResponseApi } from '../http/http-response';
export interface Role {
  name: string;
  id: number;
  note: string;
}

export interface RoleResponse extends HttpResponseApi<Role> {}
