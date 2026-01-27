import { HttpResponseApi, HttpResponseApiFindOne } from '../http/http-response';

export interface Permission {
    id: number;
    name: string;
    description: string;
}

export interface PermissionResponse extends HttpResponseApiFindOne<Permission> { }
export interface PermissionsResponse extends HttpResponseApi<Permission> { }
