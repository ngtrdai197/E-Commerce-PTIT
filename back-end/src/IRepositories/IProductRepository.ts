import { injectable } from "inversify";
import { IProduct, IFeedback } from "../entities";

@injectable()
export abstract class IProductRepository {
    abstract findOne(query: any): Promise<IProduct>;
    abstract findAll(query: any): Promise<IProduct[] | any>;
    abstract create(product: IProduct): Promise<IProduct>;
    abstract update(product: IProduct, feedback?: IFeedback): Promise<IProduct>;
    abstract delete(id: string): Promise<any>;
    abstract search(query: any): Promise<IProduct[]>;
    abstract relatedProduct(query: any): Promise<IProduct[]>;
}
