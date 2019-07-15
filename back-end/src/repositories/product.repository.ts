import { injectable } from "inversify";
import { IProductRepository } from "../IRepositories";
import { IProduct, productModel } from "../entities";

@injectable()
export class ProductRepository implements IProductRepository {
    findOne = async (query: any): Promise<IProduct> => {
        const product = await productModel.findOne(query);
        return product as IProduct;
    };

    findAll = async (query: any): Promise<IProduct[]> => {
        return await productModel.find(query);
    };

    create = async (product: IProduct): Promise<IProduct> => {
        return await productModel.create(product);
    };

    update = async (product: IProduct): Promise<IProduct> => {
        await productModel.findByIdAndUpdate(product.id, product);
        const updated = await productModel.findById(product.id);
        return updated as IProduct;
    };

    delete = async (id: string): Promise<any> => {
        await productModel.findByIdAndRemove(id);
        return { isDeleted: true, message: `Successfully deleted product with id: ${id}` };
    }
}
