import { injectable } from "inversify";
import { IProductRepository } from "../IRepositories";
import { IProduct, productModel, IFeedback } from "../entities";

@injectable()
export class ProductRepository implements IProductRepository {
    findOne = async (query: any): Promise<IProduct> => {
        const product = await productModel.findOne(query).populate({ path: 'feedback.customer', select: 'fullName avatar' });
        return product as IProduct;
    };

    findAll = async (query: any): Promise<IProduct[]> => {
        return await productModel.find(query);
    };

    create = async (product: IProduct): Promise<IProduct> => {
        return await productModel.create(product);
    };

    update = async (product: IProduct, feedback?: IFeedback): Promise<any> => {
        const updated = await productModel.findById(product.id);
        if (updated) {
            if (feedback) {
                return await productModel.findByIdAndUpdate(product.id, { $push: { feedback: feedback } }).populate({ path: 'feedback.customer' });
            }
            return await productModel.findByIdAndUpdate(product.id, product).populate('feedback.customer');
        }
        // return updated as IProduct;
    };

    delete = async (id: string): Promise<any> => {
        await productModel.findByIdAndRemove(id);
        return { isDeleted: true, message: `Successfully deleted product with id: ${id}` };
    }
}
