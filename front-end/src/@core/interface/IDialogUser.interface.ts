import { IUser } from './IUser.interface';
import { ICategory } from './ICategory.interface';

export interface IDialogUser {
  user: IUser;
  status: Boolean;
}
export interface IDialogCategory {
  category: ICategory;
  status: Boolean;
}
