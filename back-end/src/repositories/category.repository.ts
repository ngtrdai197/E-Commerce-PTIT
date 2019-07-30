import { injectable } from "inversify";
import { ICategoryRepository } from "../IRepositories";
import { ICategory, categoryModel } from "../entities";

@injectable()
export class CategoryRepository implements ICategoryRepository {

  findOne = async (query: any): Promise<ICategory> => {
    const category = await categoryModel.findOne(query);
    return category as ICategory;
  };

  findOnePopulate = async (query: any): Promise<ICategory> => {
    const category = await categoryModel.findOne(query).populate('products');
    return category as ICategory;
  };

  findAll = async (): Promise<ICategory[]> => {
    return await categoryModel.find().populate('products');
  };

  findAllCategoryName = async (): Promise<ICategory[]> => {
    return await categoryModel.find();
  };

  updateMapping = async (query: any, id: string): Promise<ICategory> => {
    return await categoryModel.update({ _id: id }, query);
  }

  create = async (category: ICategory): Promise<ICategory> => {
    return await categoryModel.create(category);
  };

  update = async (category: ICategory): Promise<ICategory> => {
    await categoryModel.findByIdAndUpdate(category.id, category);
    const updated = await categoryModel.findById(category.id);
    return updated as ICategory;
  };

  delete = async (id: string): Promise<any> => {
    await categoryModel.findByIdAndRemove(id);
    return { isDeleted: true, message: `Successfully deleted category with id: ${id}` };
  }
}
