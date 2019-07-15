import { IProduct } from './IProduct.interface';

export interface ICategory{
  id?: String;
  categoryName: String;
  products?: IProduct[] | String[]
}
