import { Profile } from '@assets/retail-shop/Profile';

export interface UserAdd {
  warehouse?: number;
  positionType?: number;
  roles: string[];
  user: UserContactInfo;
}

type UserContactInfo = Pick<Profile, 'fullName' | 'username' | 'phone' | 'address'>;
