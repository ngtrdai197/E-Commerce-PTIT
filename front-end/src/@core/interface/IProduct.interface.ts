import { IUser } from './index';

export interface IProduct {
  id?: string;
  productName: string;
  title: string;
  currentPrice: number;
  category: string
  oldPrice?: number;
  discount?: number;
  description?: string
  images?: string[];
  productTotal?: number;
  productAvailable?: number;
  ratings?: number; // ratings
  sex: number; // 0 male 1 female
  productBoughtBy?: Customer;
  order?: ICart;
  feedback?: IFeedback[];
}

export interface Customer {
  customer?: IUser | string;
  boughtAtDate?: Date;
}

export interface IFeedback {
  _id?: string;
  customer?: string | IUser;
  content?: string;
  createdAtDate?: string | Date;
}

export interface ICart {
  quantityOrder?: number;
  totalPayment?: number;
}