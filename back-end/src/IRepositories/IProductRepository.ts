import { IProduct, IFeedback } from "../entities";

export interface IProductRepository {
  findOne(query: any): Promise<IProduct>;
  findAll(query: any): Promise<IProduct[] | any>;
  create(product: IProduct): Promise<IProduct>;
  update(product: IProduct, feedback?: IFeedback): Promise<IProduct>;
  delete(id: string): Promise<any>;
  search(query: any): Promise<any>;
  relatedProduct(query: any): Promise<IProduct[]>;
}
