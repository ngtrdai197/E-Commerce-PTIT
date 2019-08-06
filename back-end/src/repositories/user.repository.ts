import { injectable } from "inversify";
import { IUserRepository } from "../IRepositories";
import { IUser, userModel } from "../entities";

@injectable()
export class UserRepository implements IUserRepository {
  findOne = async (query: any): Promise<IUser> => {
    const user = await userModel.findOne(query).select('-__v');
    return user as IUser;
  };

  findAll = async (): Promise<IUser[]> => {
    return await userModel.find({ isDeleted: false }).select('-__v -password');
  };

  getUserProfile = async (query: any): Promise<IUser> => {
    const profile = await userModel.findOne(query).select('-password');
    return profile as IUser;
  }

  create = async (user: IUser): Promise<IUser> => {
    return await userModel.create(user);
  };

  update = async (user: IUser): Promise<IUser> => {
    const updated = await userModel.findByIdAndUpdate(user.id, user).select('-password');
    // const updated = await userModel.findById(user.id).select('-__v');
    return updated as IUser;
  };

  delete = async (id: string): Promise<any> => {
    await userModel.update({ _id: id }, { isDeleted: true });
    return { isDeleted: true, message: `Successfully deleted user with id: ${id}` };
  }
}
