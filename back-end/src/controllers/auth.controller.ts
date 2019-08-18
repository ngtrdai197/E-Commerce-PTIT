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
    /**
        * @api {post} /api/auth/login Login into system
        * @apiName Login
        * @apiGroup Authentication 
        * @apiSampleRequest http://localhost:3000/api/auth/login
        * @apiParam {String} username  Username of the User.
        * @apiParam {String} password  Password of the User.
        * 
        * @apiParamExample {json} Request-Example:
        *   {
        *     "username": "ngducloc123",
        *     "password": "Aloalo123"
        *   }
        *
        * @apiParam {String} username  Username of the User.
        * @apiParam {String} password  Password of the User.
        *
        * @apiSuccessExample Success-Response:
        *     HTTP/1.1 200 OK
        *       {
        *          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMjM4NTRmNGI4ZWYyMzUyZTZiMTQ2YSIsInVzZXJuYW1lIjoibmdkdWNsb2MxMjMiLCJlbWFpbCI6Im5nZHVjbG9jMTIzQGdtYWlsLmNvbSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNTY2MDM0NzU4LCJleHAiOjE1NjY2Mzk1NTh9.jENSu3mhGU86MQFXl49Yhq1EivEQPIT_YriL_5tYlVE"
        *      }
        *
        * @apiError BadRequest Thông tin đăng nhập không hợp lệ. Kiểm tra lại!.
        * 
        *
        * @apiErrorExample Error-Response:
        *     HTTP/1.1 400 BadRequest
        *     {
        *       "statusCode": 400,
        *       "message": "BadRequest" 
        *     }
    */
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

    /**
        * @api {get} /api/auth/profile Get profile of user
        * @apiHeader {String} x-access-token Tokens review user permissions.
        * @apiName GetProfileUser
        * @apiGroup Authentication 
        * @apiSampleRequest http://localhost:3000/api/auth/profile
        *
        * @apiSuccessExample Success-Response:
        *     HTTP/1.1 200 OK
        *     {
        *        "isDeleted": false,
        *        "role": "User",
        *        "_id": "5d23854f4b8ef2352e6b146a",
        *        "username": "ngducloc123",
        *        "fullName": "Nguyễn Đức Lộc",
        *        "phone": "0986610028",
        *        "email": "ngducloc123@gmail.com",
        *        "address": "Ha Noi",
        *        "__v": 0,
        *        "avatar": "avatars/1565342616789-mbuntu (3).png",
        *        "id": "5d23854f4b8ef2352e6b146a"
        *      }
        *
        * @apiError UnAuthorization Token invalid.
        * 
        *
        * @apiErrorExample Error-Response:
        *     HTTP/1.1 401 UnAuthorization
        *     {
        *       "statusCode": 401,
        *       "message": "UnAuthorization" 
        *     }
    */
    @httpGet('/profile', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    async getUserProfile(req: any): Promise<any> {
        return await this.userRepo.getUserProfile({ _id: req.user.id });
    }

    @httpPost('/changepassword')
    async changePassword(req: Request): Promise<any> {
        const body = req.body as IUser;
        const user = await this.userRepo.findOne({ username: body.username });
        if (user) {
            return user; // check salt and sent mail to verify
        }
    }
}