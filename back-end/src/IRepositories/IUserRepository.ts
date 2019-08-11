import { IUser } from "../entities";

export interface IUserRepository {
  findOne(query: any): Promise<IUser>;
  findAll(): Promise<IUser[]>;
  getUserProfile(query: any): Promise<IUser>;
  create(user: IUser): Promise<IUser>;
  update(user: IUser): Promise<IUser>;
  delete(id: string): Promise<any>;
}
