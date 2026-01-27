import { HttpResponseApi, HttpResponseApiFindOne } from '../http/http-response';

export interface Branch {
    id: number;
    name: string;
    code: string;
    address: string;
    phone: string;
    active: boolean;
}

export interface BranchResponse extends HttpResponseApiFindOne<Branch> { }
export interface BranchesResponse extends HttpResponseApi<Branch> { }
