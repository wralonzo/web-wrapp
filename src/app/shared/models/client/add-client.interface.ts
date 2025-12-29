import { ClientTypes } from "@shared/enums/clients/Client-type.enum";

export interface AddClient {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: number;
  birthDate?: string;
  clientType: ClientTypes;
  warehouseId?: number;
  flagUser?: boolean;
}
