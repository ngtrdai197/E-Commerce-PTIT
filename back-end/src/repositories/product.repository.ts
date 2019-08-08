import { injectable } from "inversify";
import { IProductRepository } from "../IRepositories";
import { IProduct, productModel, IFeedback } from "../entities";

@injectable()
export class ProductRepository implements IProductRepository {
    findOne = async (query: any): Promise<IProduct> => {
        const product = await productModel.findOne(query).populate({ path: 'feedback.customer', select: 'fullName avatar' });
        return product as IProduct;
    };

    search = async (query: any): Promise<any> => {
        const products = await productModel
            .find({ textSlug: { $regex: query.keyword, $options: "i" }, isDeleted: false })
            .sort({ currentPrice: query.sort })
            .skip((query.page * query.perPage) - query.perPage)
            .limit(query.perPage);
        const counter = await productModel.count({ textSlug: { $regex: query.keyword, $options: "i" }, isDeleted: false });
        const result = {
            products,
            current: query.page,
            total: counter,
            pages: Math.ceil(counter / query.perPage)
        }
        return Promise.resolve(result);
    }

    relatedProduct = async (query: any): Promise<IProduct[]> => {
        return await productModel.find(query).limit(10);
    }

    findAll = async (query: any): Promise<IProduct[] | any> => {
        const products = await productModel
            .find({ isDeleted: query.isDeleted })
            .sort({ 'createdAtDate': '-1' })
            .skip((query.page * query.perPage) - query.perPage)
            .limit(query.perPage);
        const counter = await productModel.count({ isDeleted: query.isDeleted });
        const result = {
            products,
            current: query.page,
            total: counter,
            pages: Math.ceil(counter / query.perPage)
        };
        return Promise.resolve(result);
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
