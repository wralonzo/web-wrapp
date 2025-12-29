import { ClientTypes } from '@shared/enums/clients/Client-type.enum';
import { HttpResponseApi } from '../http/http-response';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  birthDate?: string;
  clientType: ClientTypes;
  totalSpent: number;
  status: 1 | 2 | 2;
  address?: string;
  notes?: string;
}

export interface ClientResponse extends HttpResponseApi<Client> {}
