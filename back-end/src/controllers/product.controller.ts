import { controller, httpGet, httpPost, httpDelete, httpPut, requestParam } from "inversify-express-utils";
import { IProduct, IFeedback } from "../entities";
import { inject } from "inversify";
import { TYPES, constants } from "../common";
import { IProductRepository, ICategoryRepository } from "../IRepositories";
import { Request, Response } from "express";
import { upload } from "../multer";
import { unlink } from 'fs';
import { parser } from "../middleware";

@controller("/product")
export class Product {
    constructor(
        @inject(TYPES.IProductRepository) private productRepo: IProductRepository,
        @inject(TYPES.ICategoryRepository) private categoryRepo: ICategoryRepository
    ) { }

    @httpGet('/')
    public async findAll(): Promise<IProduct[]> {
        try {
            return await this.productRepo.findAll({});
        } catch (error) {
            throw error;
        }
    }

    // remove file within disk
    @httpPost('/unlink')
    public async unLink(req: Request, res: Response): Promise<any> {
        try {
            const { body } = req;
            const product = await this.productRepo.findOne({ _id: body.productId });
            if (product) {
                (product.images as []).map(async (x, index) => {
                    if (await (body.linkImage as string).includes(x)) {
                        await (product.images as []).splice(index, 1);
                        await unlink(`src/public/${x}`, (error) => {
                            if (error) {
                                throw error;
                            }
                        });
                        await this.productRepo.update(product);
                    }
                });
            }
            return res.status(200).send({ isDeleted: true, message: 'Xóa hình ảnh thành công' });
        } catch (error) {
            throw error;
        }
    }

    @httpGet('/:id')
    public async findOne(@requestParam('id') id: string) {
        return await this.productRepo.findOne({ _id: id });
    }

    @httpGet("/category/:id")
    public async findByCategory(@requestParam('id') id: string): Promise<IProduct[]> {
        try {
            return await this.productRepo.findAll({ category: id });
        } catch (error) {
            throw error;
        }
    }

    @httpPost("/")
    public async create(req: Request): Promise<IProduct> {
        try {
            const { body } = req;
            body.sex = +body.sex; // if sex is string => parse to number
            const product = await this.productRepo.create(body);
            const query = { $push: { products: product } };
            await this.categoryRepo.updateMapping(query, product.category as string);
            return product;
        } catch (error) {
            throw error;
        }
    }


    @httpPut("/", upload.any())
    public async update(req: any): Promise<any> {
        try {
            const { body } = req;
            let images = [];
            for (let index = 0; index < req.files.length; index++) {
                images.push(`products/${req.files[index].filename}`);
            }
            const product = await this.productRepo.findOne({ _id: (body as IProduct).id });
            body.images = (product.images as string[]).concat(images);
            return await this.productRepo.update(body);
        } catch (error) {
            throw error;
        }
    }

    @httpPut("/feedback", parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    public async updateFeeback(req: any): Promise<any> {
        try {
            const { body } = req;
            const product = await this.productRepo.findOne({ _id: body.product });
            if (!product.feeback) {
                const feedback: IFeedback = {
                    customer: req.user.id,
                    content: body.content
                };
                return await this.productRepo.update(product, feedback);
            }
        } catch (error) {
            throw error;
        }
    }

    @httpDelete('/:id')
    public async delete(req: Request): Promise<any> {
        try {
            const { id } = req.params;
            const product = await this.productRepo.findOne({ _id: id });
            if (product) {
                const query = { $pull: { products: { $in: id } } };
                await this.categoryRepo.updateMapping(query, product.category as string);
            }
            return await this.productRepo.delete(id);
        } catch (error) {
            throw error;
        }
    }
}