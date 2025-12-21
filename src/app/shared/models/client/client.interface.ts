import { HttpResponseApi } from '../http/http-response';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  birthDate?: string;
  clientType?: number;
  totalSpent: number;
  status: 1 | 2 | 2;
}

export interface ClientResponse extends HttpResponseApi<Client> {}
