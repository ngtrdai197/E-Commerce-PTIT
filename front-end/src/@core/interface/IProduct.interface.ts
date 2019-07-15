import { IUser } from './index';

export interface IProduct {
  id?: String;
  productName: String;
  title: String;
  currentPrice: Number;
  category: String
  oldPrice?: Number;
  discount?: Number;
  description?: String
  images?: String[];
  productTotal?: number;
  productAvailable?: number;
  ratings?: number; // ratings
  sex: number; // 0 male 1 female
  productBoughtBy?: Customer;
  order?: ICart;
}

export interface Customer {
  customer?: IUser | String;
  boughtAtDate?: Date;
}


export interface ICart {
  quantityOrder?: Number;
  totalPayment?: Number;
}