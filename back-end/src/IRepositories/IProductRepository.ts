import { injectable } from "inversify";
import { IProduct } from "../entities";

@injectable()
export abstract class IProductRepository {
    abstract findOne(query: any): Promise<IProduct>;
    abstract findAll(query: any): Promise<IProduct[]>;
    abstract create(product: IProduct): Promise<IProduct>;
    abstract update(product: IProduct): Promise<IProduct>;
    abstract delete(id: string): Promise<any>;
}
