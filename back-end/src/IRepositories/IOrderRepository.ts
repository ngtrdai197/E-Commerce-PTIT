import { injectable } from "inversify";
import { IOrder } from "../entities";

@injectable()
export abstract class IOrderRepository {
    abstract findOne(query: any): Promise<IOrder>;
    abstract findAll(): Promise<IOrder[]>;
    abstract create(order: IOrder): Promise<IOrder>;
    abstract update(order: IOrder): Promise<IOrder>;
    abstract delete(id: string): Promise<any>;
}
