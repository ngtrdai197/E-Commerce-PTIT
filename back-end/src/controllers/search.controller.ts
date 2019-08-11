import { controller, httpGet, requestParam } from "inversify-express-utils";
import { TYPES } from "../common";
import { Response, Request } from "express";
import { IProductRepository } from "../IRepositories";
import { inject } from "inversify";
import { IProduct } from "../entities";

@controller('/search')
export class SearchController {
    constructor(@inject(TYPES.IProductRepository) private productRepo: IProductRepository) { }

    @httpGet('/')
    public async onSearch(req: Request, res: Response): Promise<IProduct[] | any> {
        try {
            const query = {
                keyword: req.query.keyword,
                sort: req.query.sort,
                sex: req.query.sex,
                page: +req.query.page,
                perPage: +req.query.perPage,
            }
            const products = await this.productRepo.search(query);
            if (products) {
                return products;
            }
            return Promise.resolve([]);
        } catch (error) {
            throw error;
        }
    }

    @httpGet('/filter/:categoryId')
    public async onRelatedProduct(@requestParam('categoryId') categoryId: string, res: Response): Promise<IProduct[] | any> {
        try {
            const query = { category: categoryId, isDeleted: false };
            const products = await this.productRepo.relatedProduct(query);
            return products;
        } catch (error) {
            throw error;
        }
    }
}