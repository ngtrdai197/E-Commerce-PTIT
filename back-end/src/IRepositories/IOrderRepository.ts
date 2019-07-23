import { injectable } from "inversify";
import { IOrder, ICart } from "../entities";

@injectable()
export abstract class IOrderRepository {
    abstract findOne(query: any): Promise<IOrder>;
    abstract findOnePopulate(query: any): Promise<IOrder>;
    abstract findAll(): Promise<IOrder[]>;
    abstract findWithFilter(query: any): Promise<IOrder[]>;
    abstract pushCart(orderId: string, cart?: ICart): Promise<any>;
    abstract pullCart(orderId: string, cartId?: string): Promise<any>;
    abstract create(order: IOrder, cart?: ICart): Promise<IOrder>;
    abstract update(order: IOrder): Promise<IOrder>;
    abstract delete(id: string): Promise<any>;
}
