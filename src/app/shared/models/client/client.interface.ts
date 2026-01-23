import { ClientTypes } from '@shared/enums/clients/Client-type.enum';
import { HttpResponseApi, HttpResponseApiFindOne } from '../http/http-response';

export interface Client {
  clientType: ClientTypes;
  code: string;
  companyId: number;
  id: number;
  birthDate: string;
  preferredDeliveryAddress: string;
  profile: {
    address: string;
    email: string;
    fullName: string;
    id: number;
    phone: string;
  },
  taxId: string,
  user: {
    id: number;
    username: string;
    password: string;
    passwordInit: string;
  }
}

export interface ClientResponse extends HttpResponseApi<Client> { }
export interface ClientResponseFindOne extends HttpResponseApiFindOne<Client> { }
