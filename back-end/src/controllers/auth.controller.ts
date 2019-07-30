import { inject } from "inversify";
import { TYPES, constants } from "../common";
import { IUserRepository } from "../IRepositories";
import { httpPost, httpGet, controller } from "inversify-express-utils";
import { Request, Response } from "express";
import { IUser } from "../entities";
import { compareSync } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { parser } from "../middleware";

@controller('/auth')
export class AuthController {
    constructor(@inject(TYPES.IUserRepository) private userRepo: IUserRepository) { }

    @httpPost('/login')
    async login(req: Request, res: Response): Promise<any> {
        try {
            const user = req.body;
            const data = await this.userRepo.findOne({ username: user.username });
            if (data && !data.isDeleted) {
                if (await compareSync(user.password as string, data.password as string)) {
                    const payload = {
                        id: data.id,
                        username: data.username,
                        email: data.email,
                        role: data.role
                    };
                    const token = await jwt.sign(payload, constants.SECRECT_KEY, { expiresIn: '7d' });
                    return Promise.resolve({ token });
                }
            }
            return res.status(400).send('Thông tin đăng nhập không hợp lệ. Kiểm tra lại!');
        } catch (error) {
            throw error;
        }
    }

    @httpPost('/changepassword')
    async changePassword(req: Request): Promise<any> {
        const body = req.body as IUser;
        const user = await this.userRepo.findOne({ username: body.username });
        if (user) {
            return user; // check salt and sent mail to verify
        }
    }

    @httpGet('/profile', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    async getUserProfile(req: any): Promise<any> {
        return await this.userRepo.getUserProfile({ _id: req.user.id });
    }
}