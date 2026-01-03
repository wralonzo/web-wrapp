import { User } from './user.model';

export interface UserAdd {
  warehouse?: number;
  positionType?: number;
  roles: string[];
  user: UserContactInfo;
}

type UserContactInfo = Pick<User, 'fullName' | 'username' | 'phone' | 'address'>;
