import { controller, httpGet, requestParam } from "inversify-express-utils";
import { parser } from "../middleware";
import { constants, TYPES } from "../common";
import { Response } from "express";
import { IProductRepository } from "../IRepositories";
import { inject } from "inversify";
import { IProduct } from "../entities";
import { toSlug } from '../common/slug';

@controller('/search')
export class SearchController {
    constructor(@inject(TYPES.IProductRepository) private productRepo: IProductRepository) { }

    @httpGet('/:keyword', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    public async onSearch(@requestParam('keyword') keyword: string, res: Response): Promise<IProduct[] | any> {
        try {
            const products = await this.productRepo.search(toSlug(keyword));
            if (products) {
                // return res.status(200).send(products);
                return products;
            }
            return Promise.resolve([]);
        } catch (error) {
            throw error;
            // return res.status(500).json({ statusCode: 500, message: error.message });
        }
    }

    @httpGet('/filter/:categoryId', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    public async onRelatedProduct(@requestParam('categoryId') categoryId: string, res: Response): Promise<IProduct[] | any> {
        try {
            const query = { category: categoryId, isDeleted: false };
            const products = await this.productRepo.relatedProduct(query);
            return products;
        } catch (error) {
            throw error;
            // return res.status(500).json({ statusCode: 500, message: error.message });
        }
    }
}