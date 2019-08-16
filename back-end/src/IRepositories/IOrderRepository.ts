import { IOrder, ICart } from "../entities";

export interface IOrderRepository {
    findOne(query: any): Promise<IOrder>;
    findOnePopulate(query: any): Promise<IOrder>;
    findAll(): Promise<IOrder[]>;
    findWithFilter(query: any): Promise<IOrder[]>;
    pushCart(orderId: string, cart?: ICart): Promise<any>;
    pullCart(orderId: string, cartId?: string): Promise<any>;
    create(order: IOrder, cart?: ICart): Promise<IOrder>;
    update(order: IOrder): Promise<IOrder>;
    updateState(orderId: string, query: any): Promise<any>;
    delete(id: string): Promise<any>;
    removeOrdered(id: string): Promise<any>;
    checkProductExist(productId: string): Promise<boolean>;
    findAllOrderAndFilter(query: any): Promise<IOrder[]>;
}
