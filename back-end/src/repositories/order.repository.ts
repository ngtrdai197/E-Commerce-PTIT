import { injectable } from "inversify";
import { IOrderRepository } from "../IRepositories";
import { IOrder, orderModel, ICart } from "../entities";

@injectable()
export class OrderRepository implements IOrderRepository {

    findOne = async (query: any): Promise<IOrder> => {
        const order = await orderModel.findOne(query);
        return order as IOrder;
    };

    findOnePopulate = async (query: any): Promise<IOrder> => {
        const order = await orderModel.findOne(query).populate('carts.product');
        return order as IOrder;
    };

    findAll = async (): Promise<IOrder[]> => {
        return await orderModel.find({});
    };

    findWithFilter = async (query: any): Promise<IOrder[]> => {
        return await orderModel.find(query);
    };

    create = async (order: IOrder, cart?: ICart): Promise<any> => {
        return await orderModel.create(order);
    };

    update = async (order: IOrder): Promise<any> => {
        return await orderModel.findByIdAndUpdate(order.id, order);
    };

    pushCart = async (orderId: string, cart?: ICart): Promise<any> => {
        await orderModel.update({ _id: orderId }, { $push: { carts: cart } });
        return await orderModel.findById(orderId).populate('carts.product');
    }

    pullCart = async (orderId: string, cartId?: string): Promise<any> => {
        await orderModel.update({ _id: orderId }, { $pull: { carts: { _id: cartId } } });
        return await orderModel.findById(orderId).populate('carts.product');
    }

    delete = async (id: string): Promise<any> => {
        await orderModel.findByIdAndRemove(id);
        return { isDeleted: true, message: `Successfully deleted order with id: ${id}` };
    }
}
