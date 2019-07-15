import { injectable } from "inversify";
import { IOrderDetailsRepository } from "../IRepositories";
import { IOrderDetails, orderDetailModel } from "../entities";

@injectable()
export class OrderDetailsRepository implements IOrderDetailsRepository {
    findOne = async (query: any): Promise<IOrderDetails> => {
        const orderDetails = await orderDetailModel.findOne(query);
        return orderDetails as IOrderDetails;
    };

    findAll = async (): Promise<IOrderDetails[]> => {
        return await orderDetailModel.find({});
    };

    create = async (orderDetails: IOrderDetails): Promise<IOrderDetails> => {
        return await orderDetailModel.create(orderDetails);
    };

    update = async (orderDetails: IOrderDetails): Promise<IOrderDetails> => {
        await orderDetailModel.findByIdAndUpdate(orderDetails.id, orderDetails);
        const updated = await orderDetailModel.findById(orderDetails.id);
        return updated as IOrderDetails;
    };

    delete = async (id: string): Promise<any> => {
        await orderDetailModel.findByIdAndRemove(id);
        return { isDeleted: true, message: `Successfully deleted orderDetails with id: ${id}` };
    }
}
