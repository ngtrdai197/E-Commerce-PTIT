import { injectable } from "inversify";
import { IOrderRepository } from "../IRepositories";
import { IOrder, orderModel, ICart } from "../entities";

@injectable()
export class OrderRepository implements IOrderRepository {

    checkProductExist = async (productId: string): Promise<boolean> => {
        const result = await orderModel.find({ 'carts.product': productId });
        let flag = true;
        result.length > 0 ? flag : flag = false;
        return flag;
    }

    findOne = async (query: any): Promise<IOrder> => {
        const order = await orderModel.findOne(query);
        return order as IOrder;
    };

    findOnePopulate = async (query: any): Promise<IOrder> => {
        const order = await orderModel.findOne(query).populate('carts.product').populate({ path: 'user', select: '-password' });
        return order as IOrder;
    };

    findAll = async (): Promise<IOrder[]> => {
        return await orderModel.find({});
    };

    findWithFilter = async (query: any): Promise<IOrder[]> => {
        return await orderModel.find(query)
            .populate('carts.product')
            .populate({ path: 'user', select: '-password' });
    };

    findAllOrderAndFilter = async (query: any): Promise<IOrder[]> => {
        return await orderModel.find(query)
            .populate({ path: 'user', select: '-password' });
    }

    create = async (order: IOrder): Promise<any> => {
        return await orderModel.create(order);
    };

    update = async (order: IOrder): Promise<any> => {
        return await orderModel.findByIdAndUpdate(order.id, order);
    };

    updateState = async (orderId: string, query: any): Promise<any> => {
        return await orderModel.findByIdAndUpdate(orderId, query);
    }

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

    removeOrdered = async (id: string): Promise<any>=> {
        return  await orderModel.findByIdAndRemove(id);
    }
}
