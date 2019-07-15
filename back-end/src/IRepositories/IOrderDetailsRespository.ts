import { injectable } from "inversify";
import { IOrderDetails } from "../entities";

@injectable()
export abstract class IOrderDetailsRepository {
    abstract findOne(query: any): Promise<IOrderDetails>;
    abstract findAll(): Promise<IOrderDetails[]>;
    abstract create(orderDetails: IOrderDetails): Promise<IOrderDetails>;
    abstract update(orderDetails: IOrderDetails): Promise<IOrderDetails>;
    abstract delete(id: string): Promise<any>;
}
