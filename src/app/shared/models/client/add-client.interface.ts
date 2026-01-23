import { ClientTypes } from "@shared/enums/clients/Client-type.enum";

export interface AddClient {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  preferredDeliveryAddress?: string;
  taxId?: string;
  birthDate?: string;
  clientType: ClientTypes;
  companyId?: number;
  flagUser?: boolean;
  username?: string;
  password?: string;
}
