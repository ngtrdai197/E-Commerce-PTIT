import { inject } from "inversify";
import { TYPES } from "../common";
import { ICategoryRepository } from "../IRepositories";
import { httpGet, controller, httpPost, httpPut, httpDelete } from "inversify-express-utils";
import { ICategory, IProduct } from "../entities";
import { Request, Response } from "express";

@controller("/category")
export class Category {
    constructor(@inject(TYPES.ICategoryRepository) private categoryRespository: ICategoryRepository) { }

    @httpGet("/")
    public async findAll(): Promise<ICategory[]> {
        try {
            return await this.categoryRespository.findAll();
        } catch (error) {
            throw error;
        }
    }

    @httpGet('/find/:id')
    public async findOne(req: Request): Promise<ICategory> {
        try {
            return this.categoryRespository.findOnePopulate({ _id: req.params.id });
        } catch (error) {
            throw error;
        }
    }

    @httpPost("/")
    public async create(req: Request): Promise<ICategory> {
        try {
            const { body } = req;
            return await this.categoryRespository.create(body);
        } catch (error) {
            throw error;
        }
    }

    @httpPut("/")
    public async update(req: Request): Promise<ICategory> {
        try {
            const { body } = req;
            return await this.categoryRespository.update(body);
        } catch (error) {
            throw error;
        }
    }

    @httpDelete("/:id")
    public async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const category = await this.categoryRespository.findOne({ _id: id });
            if ((category.products as IProduct[]).length > 0) {
                return res.status(400).send('Danh mục hiện đang chứa sản phẩm. Nên không thể xóa');
            }
            return await this.categoryRespository.delete(id);
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    @httpGet("/query")
    public async categoryTypes(req: Request, res: Response): Promise<any> {
        try {
            const data = await this.categoryRespository.findAllCategoryName();
            if (!data) return res.status(404).json({ statusCode: 404, message: 'Danh mục sản phẩm không tồn tại' });
            return res.status(200).send(data);
        } catch (error) {
            throw error;
        }
    }
}
