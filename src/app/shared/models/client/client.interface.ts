import { ClientTypes } from '@shared/enums/clients/Client-type.enum';
import { HttpResponseApi, HttpResponseApiFindOne } from '../http/http-response';
import { User } from '../user/user.model';

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
  code: string;
  user?: User;
}

export interface ClientResponse extends HttpResponseApi<Client> {}
export interface ClientResponseFindOne extends HttpResponseApiFindOne<Client> {}
