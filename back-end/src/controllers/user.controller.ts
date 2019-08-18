import { controller, httpGet, httpPost, httpPut, httpDelete } from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";
import { TYPES, constants } from "../common";
import { IUser } from "../entities";
import { parser } from "../middleware";
import { hashSync } from 'bcryptjs';
import { email } from '../common/email';
import { IUserRepository } from "../IRepositories";
import { upload } from "../multer/user.multer";

@controller("/user")
export class UserController {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) { }
  /**
    * @api {get} /api/user Get All Users information
    * @apiHeader {String} x-access-token Tokens review user permissions.
    * @apiPermission Admin
    * @apiName GetUsers
    * @apiGroup User
    *
    * @apiSuccess {String} fullName Full name of the User.
    * @apiSuccess {String} username  Username of the User.
    * @apiSuccess {String} address  Address of the User.
    * @apiSuccess {String} email  Email of the User.
    * @apiSuccess {String} phone  Phone number of the User.
    * @apiSuccess {String} role  Role of the User.
    * @apiSuccess {Boolean} isDeleted  whether the user state has been deleted or not.
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     [
    *       {
    *          "isDeleted": false,
    *          "role": "User",
    *          "_id": "5d1dda4ed58a82199db986de",
    *          "username": "ngdai123",
    *          "fullName": "Dai Nguyen",
    *          "address": "Viet Nam",
    *          "email": "ngdai123@gmail.com",
    *          "phone": "0375629888",
    *          "id": "5d1dda4ed58a82199db986de"
    *       },
    *       {
    *          "isDeleted": false,
    *          "role": "User",
    *          "_id": "5d23854f4b8ef2352e6b146a",
    *          "username": "ngducloc123",
    *          "fullName": "Nguyễn Đức Lộc",
    *          "phone": "0986610028",
    *          "email": "ngducloc123@gmail.com",
    *          "address": "Ha Noi",
    *          "avatar": "avatars/1565342616789-mbuntu (3).png",
    *          "id": "5d23854f4b8ef2352e6b146a"
    *      }
    *     ]
    *
    * @apiError NotPermission You have not permission.
    * 
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 403 Not Found
    *     {
    *       "error": "NotPermission"
    *     }
  */
  @httpGet("/")
  public async findAll(): Promise<IUser[]> {
    try {
      const users = await this.userRepository.findAll({ isDeleted: false });
      return users;
    } catch (error) {
      throw error;
    }
  }

  /**
    * @api {get} /api/user/find/:id Get a user information by ID
    * @apiPermission Admin
    * @apiHeader {String} x-access-token Tokens review user permissions.
    * @apiName GetUserByID
    * @apiGroup User
    *
    * @apiParam {Number} id Users unique ID.
    *
    * @apiSuccess {String} fullName Full name of the User.
    * @apiSuccess {String} username  Username of the User.
    * @apiSuccess {String} address  Address of the User.
    * @apiSuccess {String} email  Email of the User.
    * @apiSuccess {String} phone  Phone number of the User.
    * @apiSuccess {String} role  Role of the User.
    * @apiSuccess {Boolean} isDeleted  whether the user state has been deleted or not.
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *          "isDeleted": false,
    *          "role": "User",
    *          "_id": "5d23854f4b8ef2352e6b146a",
    *          "username": "ngducloc123",
    *          "fullName": "Nguyễn Đức Lộc",
    *          "phone": "0986610028",
    *          "email": "ngducloc123@gmail.com",
    *          "address": "Ha Noi",
    *          "avatar": "avatars/1565342616789-mbuntu (3).png",
    *          "id": "5d23854f4b8ef2352e6b146a"
    *      }
    *
    * @apiError UserNotFound User not found.
    * @apiError CastObjectIdFailed to ObjectId failed for value id.
    * 
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *       "error": "UserNotFound"
    *     }
    *     HTTP/1.1 500 Server Error
    *     {
    *       "error": "CastObjectIdFailed"
    *     }
  */
  @httpGet("/find/:id", parser([constants.ROLES.ADMIN]))
  public async findOne(req: Request, res: Response) {
    try {
      const query = { _id: req.params.id };
      const result = await this.userRepository.findOne(query);
      if (result) {
        return res.status(200).send(result)
      }
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    } catch (error) {
      return res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  /**
    * @api {get} /api/user/token Get a user information by token
    * @apiHeader {String} x-access-token Tokens review user permissions.
    * @apiName GetProfileUserByToken
    * @apiGroup User
    *
    * @apiSuccess {String} fullName Full name of the User.
    * @apiSuccess {String} username  Username of the User.
    * @apiSuccess {String} address  Address of the User.
    * @apiSuccess {String} email  Email of the User.
    * @apiSuccess {String} phone  Phone number of the User.
    * @apiSuccess {String} role  Role of the User.
    * @apiSuccess {Boolean} isDeleted  whether the user state has been deleted or not.
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *          "isDeleted": false,
    *          "role": "User",
    *          "_id": "5d23854f4b8ef2352e6b146a",
    *          "username": "ngducloc123",
    *          "fullName": "Nguyễn Đức Lộc",
    *          "phone": "0986610028",
    *          "email": "ngducloc123@gmail.com",
    *          "address": "Ha Noi",
    *          "avatar": "avatars/1565342616789-mbuntu (3).png",
    *          "id": "5d23854f4b8ef2352e6b146a"
    *      }
    *
    * @apiError TokenInvalid Token Invalid.
    * 
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 401 Token Invalid
    *     {
    *       "error": "TokenInvalid"
    *     }
  */
  @httpGet("/token", parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
  public async getUserProfile(req: any, res: Response) {
    try {
      const query = { _id: req.user.id };
      const result = await this.userRepository.getUserProfile(query);
      if (result) {
        return res.status(200).send(result)
      }
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    } catch (error) {
      return res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  /**
    * @api {post} /api/user Create a user
    * @apiHeader {String} x-access-token Tokens review user permissions.
    * @apiName CreateUser
    * @apiGroup User 
    * @apiSampleRequest http://localhost:3000/
    * @apiParam {String} fullName Full name of the User.
    * @apiParam {String} username  Username of the User.
    * @apiParam {String} address  Address of the User.
    * @apiParam {String} email  Email of the User.
    * @apiParam {String} phone  Phone number of the User.
    * @apiParam {String} password  Password of the User.
    * 
    * 
    * @apiParamExample {json} Request-Example:
    *   {
    *     "username": "ngducloc123",
    *     "fullName": "Nguyễn Đức Lộc",
    *     "phone": "0986610028",
    *     "email": "ngducloc123@gmail.com",
    *     "address": "Ha Noi"
    *   }
    *
    * @apiParam {String} fullName Full name of the User.
    * @apiParam {String} username  Username of the User.
    * @apiParam {String} address  Address of the User.
    * @apiParam {String} email  Email of the User.
    * @apiParam {String} phone  Phone number of the User.
    * @apiParam {String} password  Password of the User.
    * 
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *          "statusCode": 200,
    *          "message": "Tạo tài khoản thành công!"
    *      }
    *
    * @apiError BadRequest submission information.
    * 
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 400 BadRequest
    *     {
    *       "statusCode": 400,
    *       "message": "BadRequest" 
    *     }
  */
  @httpPost("/")
  public async create(req: Request, res: Response) {
    try {
      const user = req.body as IUser;
      const checkUserName = await this.userRepository.findOne({ username: user.username });
      if (!checkUserName) {
        const checkEmail = await this.userRepository.findOne({ email: user.email });
        if (!checkEmail) {
          const checkPhone = await this.userRepository.findOne({ phone: user.phone });
          if (!checkPhone) {
            user.password = await hashSync((user.password as string), 10);
            const created = await this.userRepository.create(user);
            if (created) {
              return res.status(200).json({ statusCode: 200, message: 'Tạo tài khoản thành công!' });
            }
          }
          return res.status(400).send({ statusCode: 400, message: 'Số điện thoại đã bị trùng' });
        }
        return res.status(400).send({ statusCode: 400, message: 'Email đã bị trùng' });
      }
      return res.status(400).send({ statusCode: 400, message: 'Username đã bị trùng' });
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

  /**
   * @api {put} /api/user/update Update a user information
   * @apiHeader {String} x-access-token Tokens review user permissions.
   * @apiName UpdateUser
   * @apiGroup User
   * @apiSampleRequest http://localhost:3000/
   * @apiParam {String} fullName Full name of the User.
   * @apiParam {String} username  Username of the User.
   * @apiParam {String} address  Address of the User.
   * @apiParam {String} email  Email of the User.
   * @apiParam {String} phone  Phone number of the User.
   * @apiParamExample {json} Request-Example:
   *   {
   *     "username": "nguyendai.coder",
   *     "fullName": "I am Coder <3",
   *     "phone": "03756298889",
   *     "email": "ngducloc123@gmail.com",
   *     "address": "429/6 Đường 429, Phường Tăng Nhơn Phú A, Quận 9, TP.HCM"
   *   }
   * @apiSuccess {String} fullName Full name of the User.
   * @apiSuccess {String} username  Username of the User.
   * @apiSuccess {String} address  Address of the User.
   * @apiSuccess {String} email  Email of the User.
   * @apiSuccess {String} phone  Phone number of the User.
   * @apiSuccess {String} id  Id of the User.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *    {
   *      "isDeleted": false,
   *      "role": "User",
   *      "_id": "5d4fffcc81a296253c1d6d9a",
   *      "username": "nguyendai.coder",
   *      "fullName": "I am Coder <3",
   *      "address": "429/6 Đường 429, Phường Tăng Nhơn Phú A, Quận 9, TP.HCM",
   *      "email": "ngtrdai.coder@gmail.com",
   *      "phone": "03756298889",
   *      "__v": 0,
   *      "id": "5d4fffcc81a296253c1d6d9a"
   *    }
   *
   * @apiError NotAuthorization Not authorized.
   * 
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 BadRequest
   *     {
   *       "statusCode": 401,
   *       "message": "NotAuthorization" 
   *     }
 */
  @httpPut("/update", upload.any(), parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
  public async update(req: any, res: Response) {
    try {
      const user = (req.body as IUser);
      if (req.files && req.files.length > 0) {
        user.avatar = `avatars/${req.files[0].filename}`;
      }
      if (user.password) {
        user.password = await hashSync(user.password as string, 10);
      }
      const checkEmail = await this.userRepository.findOne({ email: user.email, isDeleted: false, _id: { $ne: user.id } });
      if (!checkEmail) {
        const checkPhone = await this.userRepository.findOne({ phone: user.phone, isDeleted: false, _id: { $ne: user.id } });
        if (!checkPhone) {
          const result = await this.userRepository.update(user);
          return res.status(200).send(result);
        }
        return res.status(400).send({ statusCode: 400, message: 'Số điện thoại đã bị trùng' });
      }
      return res.status(400).send({ statusCode: 400, message: 'Email đã bị trùng' });
    } catch (error) {
      return res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  /**
    * @api {delete} /api/user/:id Delete a user
    * @apiPermission Admin
    * @apiHeader {String} x-access-token Tokens review user permissions.
    * @apiParam {Number} id Users unique ID.
    * @apiName DeleteUser
    * @apiGroup User
    *
    * @apiSuccess {String} fullName Full name of the User.
    * @apiSuccess {String} username  Username of the User.
    * @apiSuccess {String} address  Address of the User.
    * @apiSuccess {String} email  Email of the User.
    * @apiSuccess {String} phone  Phone number of the User.
    * @apiSuccess {String} role  Role of the User.
    * @apiSuccess {Boolean} isDeleted  whether the user state has been deleted or not.
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *    {
    *      "isDeleted": true,
    *      "role": "User",
    *      "_id": "5d4fffcc81a296253c1d6d9a",
    *      "username": "nguyendai.coder",
    *      "fullName": "I am Coder <3",
    *      "address": "429/6 Đường 429, Phường Tăng Nhơn Phú A, Quận 9, TP.HCM",
    *      "email": "ngtrdai.coder@gmail.com",
    *      "phone": "03756298889",
    *      "__v": 0,
    *      "id": "5d4fffcc81a296253c1d6d9a"
    *    }
    *
    * @apiError TokenInvalid Token Invalid.
    * 
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 401 Token Invalid
    *     {
    *       "error": "TokenInvalid"
    *     }
  */
  @httpDelete("/:id", parser([constants.ROLES.ADMIN]))
  public async delete(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOne({ _id: req.params.id });
      user.isDeleted = true;
      return await this.userRepository.update(user);
    } catch (error) {
      return res.status(500).json({ statusCode: 500, message: error.message });
    }
  }
}
