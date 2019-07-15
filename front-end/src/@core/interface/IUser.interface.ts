import { IRole } from './IRole.interface';

export interface IUser {
  id?: String;
  username?: String;
  password?: String;
  fullName?: String;
  phone?: String,
  email?: String,
  address?: String;
  role?: IRole | String;
  avatar?: String;
}
