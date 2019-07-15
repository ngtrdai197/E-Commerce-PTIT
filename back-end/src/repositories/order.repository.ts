import { injectable } from "inversify";
import { IOrderRepository } from "../IRepositories";
import { IOrder, orderModel } from "../entities";

@injectable()
export class OrderRepository implements IOrderRepository {
    findOne = async (query: any): Promise<IOrder> => {
        const order = await orderModel.findOne(query);
        return order as IOrder;
    };

    findAll = async (): Promise<IOrder[]> => {
        return await orderModel.find({});
    };

    create = async (order: IOrder): Promise<IOrder> => {
        return await orderModel.create(order);
    };

    update = async (order: IOrder): Promise<IOrder> => {
        await orderModel.findByIdAndUpdate(order.id, order);
        const updated = await orderModel.findById(order.id);
        return updated as IOrder;
    };

    delete = async (id: string): Promise<any> => {
        await orderModel.findByIdAndRemove(id);
        return { isDeleted: true, message: `Successfully deleted order with id: ${id}` };
    }
}
