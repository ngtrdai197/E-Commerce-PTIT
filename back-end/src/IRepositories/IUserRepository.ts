import { injectable } from "inversify";
import { IUser } from "../entities";

@injectable()
export abstract class IUserRepository {
  abstract findOne(query: any): Promise<IUser>;
  abstract findAll(): Promise<IUser[]>;
  abstract getUserProfile(query: any): Promise<IUser>;
  abstract create(user: IUser): Promise<IUser>;
  abstract update(user: IUser): Promise<IUser>;
  abstract delete(id: string): Promise<any>;
}
