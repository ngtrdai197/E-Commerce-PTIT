import { injectable } from "inversify";
import { ICategory } from "../entities";

@injectable()
export abstract class ICategoryRepository {
    abstract findOne(query: any): Promise<ICategory>;
    abstract findOnePopulate(query: any): Promise<ICategory>;
    abstract findAll(): Promise<ICategory[]>;
    abstract create(category: ICategory): Promise<ICategory>;
    abstract update(category: ICategory): Promise<ICategory>;
    abstract updateMapping(query: any, id: string): Promise<ICategory>;
    abstract delete(id: string): Promise<any>;
}
