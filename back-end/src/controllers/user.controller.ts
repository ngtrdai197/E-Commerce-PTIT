import { controller, httpGet, httpPost, httpPut, httpDelete } from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";
import { TYPES, constants } from "../common";
import { IUser } from "../entities";
import { parser } from "../middleware";
import { hashSync } from 'bcryptjs';
import { email } from '../common/email';
import { IUserRepository } from "../IRepositories";
import { upload } from "../multer";

@controller("/user")
export class UserController {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) { }

  @httpGet("/")
  public async findAll(): Promise<IUser[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  @httpGet("/find/:id")
  public async findOne(req: Request): Promise<IUser> {
    try {
      const query = { _id: req.params.id };
      return await this.userRepository.findOne(query);
    } catch (error) {
      throw error;
    }
  }

  @httpGet("/token", parser([constants.ROLES.USER]))
  public async getUserProfile(req: any): Promise<IUser> {
    try {
      const query = { _id: req.user };
      return await this.userRepository.findOne(query);
    } catch (error) {
      throw error;
    }
  }

  @httpPost("/")
  public async create(req: Request, res: Response) {
    try {
      const user = req.body as IUser;
      const checkUserName = await this.userRepository.findOne({ username: user.username });
      if (!checkUserName) {
        const checkEmail = await this.userRepository.findOne({ email: user.email });
        if (!checkEmail) {
          user.password = await hashSync((user.password as string), 10);
          const created = await this.userRepository.create(user);
          if (created) {
            return res.status(200).json({ statusCode: 200, message: 'Tạo tài khoản thành công!' });
          }
        }
        return res.status(400).send('Email đã bị trùng');
      }
      return res.status(400).send('Username đã bị trùng');
    } catch (error) {
      return res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  @httpGet('/email/otp', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
  public async sendMail(req: any): Promise<any> {
    try {
      const { user } = req;
      const receiver = 'ngtrdai290197@gmail.com';
      const content = `
                <div style="color:black;">
                <h3 >Hi ${user.username} </h3>
                <p>Your recently requested to reset your password for your Shop 3s account.Click the button below to reset it.</p>
                <p><a href="www.facebook.com/ngtrdai197" style="background-color:#242234;color:#fff; border:none; 
                padding:12px 20px;font-size:15px;cursor:pointer;display: inline-block;text-decoration:none;">Reset password</a></p>
                <p>If you did not request a password reset, please ignore this email or reply to let us know.</p>
                <p>Thanks,</p>
                <div>
                `;
      const result = await email.sendEmail(receiver, content);
      if (result) {
        return Promise.resolve({ statusCode: 200, message: 'Email đã gử i đi thành công' });
      }
      return Promise.reject({ statusCode: 404, message: 'Email không tồn tại trên hệ thống. Kiểm tra lại' });
    } catch (error) {
      throw error;
    }
  }

  @httpPut("/update", upload.any(), parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
  public async update(req: any): Promise<IUser> {
    try {
      const user = (req.body as IUser);
      if (req.files && req.files.length > 0) {
        user.avatar = `avatars/${req.files[0].filename}`;
      }
      if (user.password) {
        user.password = await hashSync(user.password as string, 10);
      }
      return await this.userRepository.update(user);
    } catch (error) {
      throw error;
    }
  }

  @httpDelete("/:id")
  public async delete(req: Request): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ _id: req.params.id });
      user.isDeleted = true;
      return await this.userRepository.update(user);
    } catch (error) {
      throw error;
    }
  }
}
