import { controller, httpPost, httpGet, httpPut, requestParam, httpDelete, response } from "inversify-express-utils";
import { Response, Request } from "express";
import { inject } from "inversify";
import { TYPES, constants } from "../common";
import { IOrderRepository, IUserRepository } from "../IRepositories";
import { parser } from "../middleware";
import { ICart, IOrder, IProduct } from "../entities";
import { email } from "../common/email";
import * as express from "express";

@controller('/order')
export class OrderController {
    constructor(
        @inject(TYPES.IOrderRepository) private orderRepo: IOrderRepository,
        @inject(TYPES.IUserRepository) private userRepo: IUserRepository
    ) { }

    /**
     * @api {get} /api/order/search Get order order created date || phone || filter with state order
     * @apiPermission Admin
     * @apiHeader {String} x-access-token Tokens review user permissions.
     * @apiSampleRequest http://localhost:3000/api/order/search
     * @apiParamExample {String} Request-Example:
     *   ?keyword=01659999302&stateOrder&not-ordered&date=2019-08-13&tomorrow=2019-08-14
     * @apiParam {String} [keyword] phone of customer you want to find (keyword or date && tomorrow).
     * @apiParam {String} stateOrder State of order you want to find.
     * @apiParam {String} [date] Date created of Order you want to find.
     * @apiParam {String} [tomorrow] Tomorrow of order you want to find (keyword or date && tomorrow).
     * @apiName SearchOrder
     * @apiGroup Order
     *
     * @apiSuccess {String} createdDate Order creation date.
     * @apiSuccess {String} updatedAtDate Order updated date.
     * @apiSuccess {String} payments Type of pay.
     * @apiSuccess {Object} user customer of order.
     * @apiSuccess {String} user.fullName Full name of the User.
     * @apiSuccess {String} user.username  Username of the User.
     * @apiSuccess {String} user.address  Address of the User.
     * @apiSuccess {String} user.email  Email of the User.
     * @apiSuccess {String} user.phone  Phone number of the User.
     * @apiSuccess {String} user.role  Role of the User.
     * @apiSuccess {String} user.id  ID of the User.
     * @apiSuccess {Boolean} user.isDeleted  whether the user state has been deleted or not.
     * @apiSuccess {String} stateOrder  State current of order.
     * @apiSuccess {Boolean} statePayment State payment of order.
     * @apiSuccess {Object} carts cart of order includes products and product quantity and total pay.
     * @apiSuccess {Object[]} carts.product List product of the cart.
     * @apiSuccess {String[]} carts.product.images List image of the product.
     * @apiSuccess {String} carts.product.createdDate Product creation date.
     * @apiSuccess {String} carts.product.productName  Name of the product.
     * @apiSuccess {String} carts.product.category  Id of the Category.
     * @apiSuccess {String} carts.product.currentPrice  Current price of the product.
     * @apiSuccess {String} [carts.product.oldPrice]  Old price of the product.
     * @apiSuccess {String} carts.product.description  Description of the product.
     * @apiSuccess {String} carts.product.title  Title of the product.
     * @apiSuccess {String} carts.product.sex  Sex of the product.
     * @apiSuccess {String} carts.product.textSlug  Text slug of the product.
     * @apiSuccess {Object[]} carts.product.feedback  Feedback of the product.
     * @apiSuccess {String} carts.product.feedback.createdAtDate  Feedback creation date.
     * @apiSuccess {String} carts.product.feedback._id  Id of the feedback.
     * @apiSuccess {String} carts.product.feedback.customer  Id of the Customer.
     * @apiSuccess {String} carts.product.feedback.content  Content of the feedback about product.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *   [
     *       {
     *           "createdDate": "2019-08-16T10:02:35.495Z",
     *           "updatedAtDate": "2019-08-16T10:10:22.645Z",
     *           "payments": "Nhận tiền khi giao dịch",
     *           "statePayment": false,
     *           "_id": "5d56809a86960171f4b08f89",
     *           "user": {
     *               "isDeleted": false,
     *               "role": "User",
     *               "_id": "5d56808086960171f4b08f88",
     *               "username": "nguyenduc",
     *               "fullName": "Nguyen Duc Hoang",
     *               "phone": "01659999302",
     *               "email": "nguyenduchoang@gmail.com",
     *               "address": "96 Man Thien, Quan 9, Ho Chi Minh",
     *               "__v": 0,
     *               "id": "5d56808086960171f4b08f88"
     *           },
     *           "stateOrder": "not-ordered",
     *           "carts": [
     *               {
     *                   "_id": "5d56809a86960171f4b08f8a",
     *                   "product": {
     *                       "images": [
     *                           "products/1565336474005-(460x460)_fm_non_son_mWEB1_2_2.jpg",
     *                           "products/1565337682692-(460x460)_fm_non_son_mWEB6.jpg",
     *                           "products/1565337819438-(460x460)_fm_non-son-mWEB1_3_3.jpg"
     *                       ],
     *                       "isDeleted": false,
     *                       "createdAtDate": "2019-08-09T07:35:41.330Z",
     *                       "_id": "5d4d235d60fbc31e0815d03a",
     *                       "productName": "Nón kết",
     *                       "category": "5d4cfbe6c7473c2660edf4a2",
     *                       "currentPrice": 390000,
     *                       "oldPrice": 425000,
     *                       "description": "Vải dù được dệt từ sợi tổng hợp, tùy vào chất liệu, hàm lượng và cách dệt mà vải sẽ có những thuộc tính và chất lượng khác nhau. Vải dù Nón Sơn nhập về được dệt, nhuộm màu bằng công nghệ hiện đại tạo ra màu sắc và chất lượng tuyệt hảo. Vải dù có độ bền cao, nhẹ, thoáng mát, không thấm nước, ít bám bụi, dễ giặt, độ bền màu cao khi tiếp xúc với bức xạ.",
     *                       "title": "Nón kết MC001A-XXH10",
     *                       "sex": 0,
     *                       "textSlug": "non-ket-mc001a-xxh10",
     *                       "feedback": [],
     *                       "__v": 0,
     *                       "id": "5d4d235d60fbc31e0815d03a"
     *                   },
     *                   "totalPayment": 390000,
     *                   "quantity": 1
     *               }
     *           ],
     *           "__v": 0,
     *           "id": "5d56809a86960171f4b08f89"
     *       }
     *   ]
     *
     * @apiError NotAuthorization Not authorized.
     * @apiError NotPermission You have not permission.
     * 
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 NotAuthorization
     *     {
     *       "statusCode": 401,
     *       "message": "NotAuthorization" 
     *     },
     *     HTTP/1.2 403 NotPermission
     *     {
     *       "statusCode": 403,
     *       "message": "NotPermission" 
     *     }
     */
    @httpGet('/search', parser([constants.ROLES.ADMIN]))
    public async searchOrder(req: Request, res: Response) {
        try {
            if (req.query.keyword && req.query.date) {
                const user = await this.userRepo.findOne({ phone: req.query.keyword });
                if (!user) return res.status(400).json({ statusCode: 400, message: 'Không tìm thấy đơn theo số điện thoại' });
                const query = {
                    user: user.id,
                    createdDate: { "$gte": new Date(req.query.date), "$lt": new Date(req.query.tomorrow) },
                    stateOrder: req.query.stateOrder
                };
                const ordered = await this.orderRepo.findWithFilter(query);
                if (ordered) {
                    return res.status(200).send(ordered);
                }
                return res.status(400).json({ statusCode: 400, message: 'Không tìm thấy đơn' });
            } else if (req.query.keyword && !req.query.date) {
                const user = await this.userRepo.findOne({ phone: req.query.keyword });
                if (!user) return res.status(400).json({ statusCode: 400, message: 'Không tìm thấy đơn theo số điện thoại' });
                const query = {
                    user: user.id,
                    stateOrder: req.query.stateOrder
                };
                const ordered = await this.orderRepo.findWithFilter(query);
                if (ordered) {
                    return res.status(200).send(ordered);
                }
                return res.status(400).json({ statusCode: 400, message: 'Không tìm thấy đơn' });
            } else {
                const query = {
                    createdDate: { "$gte": new Date(req.query.date), "$lt": new Date(req.query.tomorrow) },
                    stateOrder: req.query.stateOrder
                };
                const ordered = await this.orderRepo.findWithFilter(query);
                if (ordered) {
                    return res.status(200).send(ordered);
                }
                return res.status(400).json({ statusCode: 400, message: 'Không tìm thấy đơn' });
            }

        } catch (error) {
            throw error;
        }
    }


    /**
     * @api {get} /api/order/confirm/order Confirm order to server
     * @apiHeader {String} x-access-token Tokens review user permissions.
     * @apiName ConfirmOrder
     * @apiGroup Order
     * 
     * @apiParam {String} createdDate Order creation date.
     * @apiParam {String} updatedAtDate Order updated date.
     * @apiParam {String} payments Type of pay.
     * @apiParam {Object} user customer of order.
     * @apiParam {String} user.fullName Full name of the User.
     * @apiParam {String} user.username  Username of the User.
     * @apiParam {String} user.address  Address of the User.
     * @apiParam {String} user.email  Email of the User.
     * @apiParam {String} user.phone  Phone number of the User.
     * @apiParam {String} user.role  Role of the User.
     * @apiParam {String} user.id  ID of the User.
     * @apiParam {Boolean} user.isDeleted  whether the user state has been deleted or not.
     * @apiParam {String} stateOrder  State current of order.
     * @apiParam {Boolean} statePayment State payment of order.
     * @apiParam {Object} carts cart of order includes products and product quantity and total pay.
     * @apiParam {Object[]} carts.product List product of the cart.
     * @apiParam {String[]} carts.product.images List image of the product.
     * @apiParam {String} carts.product.createdDate Product creation date.
     * @apiParam {String} carts.product.productName  Name of the product.
     * @apiParam {String} carts.product.category  Id of the Category.
     * @apiParam {String} carts.product.currentPrice  Current price of the product.
     * @apiParam {String} [carts.product.oldPrice]  Old price of the product.
     * @apiParam {String} carts.product.description  Description of the product.
     * @apiParam {String} carts.product.title  Title of the product.
     * @apiParam {String} carts.product.sex  Sex of the product.
     * @apiParam {String} carts.product.textSlug  Text slug of the product.
     * @apiParam {Object[]} carts.product.feedback  Feedback of the product.
     * @apiParam {String} carts.product.feedback.createdAtDate  Feedback creation date.
     * @apiParam {String} carts.product.feedback._id  Id of the feedback.
     * @apiParam {String} carts.product.feedback.customer  Id of the Customer.
     * @apiParam {String} carts.product.feedback.content  Content of the feedback about product.
     *
     * @apiParamExample {json} Request-Example:
     *    [
     *       {
     *           "createdDate": "2019-08-16T10:02:35.495Z",
     *           "updatedAtDate": "2019-08-16T10:10:22.645Z",
     *           "payments": "Nhận tiền khi giao dịch",
     *           "statePayment": false,
     *           "_id": "5d56809a86960171f4b08f89",
     *           "user": {
     *               "isDeleted": false,
     *               "role": "User",
     *               "_id": "5d56808086960171f4b08f88",
     *               "username": "nguyenduc",
     *               "fullName": "Nguyen Duc Hoang",
     *               "phone": "01659999302",
     *               "email": "nguyenduchoang@gmail.com",
     *               "address": "96 Man Thien, Quan 9, Ho Chi Minh",
     *               "__v": 0,
     *               "id": "5d56808086960171f4b08f88"
     *           },
     *           "stateOrder": "ordered",
     *           "carts": [
     *               {
     *                   "_id": "5d56809a86960171f4b08f8a",
     *                   "product": {
     *                       "images": [
     *                           "products/1565336474005-(460x460)_fm_non_son_mWEB1_2_2.jpg",
     *                           "products/1565337682692-(460x460)_fm_non_son_mWEB6.jpg",
     *                           "products/1565337819438-(460x460)_fm_non-son-mWEB1_3_3.jpg"
     *                       ],
     *                       "isDeleted": false,
     *                       "createdAtDate": "2019-08-09T07:35:41.330Z",
     *                       "_id": "5d4d235d60fbc31e0815d03a",
     *                       "productName": "Nón kết",
     *                       "category": "5d4cfbe6c7473c2660edf4a2",
     *                       "currentPrice": 390000,
     *                       "oldPrice": 425000,
     *                       "description": "Vải dù được dệt từ sợi tổng hợp, tùy vào chất liệu, hàm lượng và cách dệt mà vải sẽ có những thuộc tính và chất lượng khác nhau. Vải dù Nón Sơn nhập về được dệt, nhuộm màu bằng công nghệ hiện đại tạo ra màu sắc và chất lượng tuyệt hảo. Vải dù có độ bền cao, nhẹ, thoáng mát, không thấm nước, ít bám bụi, dễ giặt, độ bền màu cao khi tiếp xúc với bức xạ.",
     *                       "title": "Nón kết MC001A-XXH10",
     *                       "sex": 0,
     *                       "textSlug": "non-ket-mc001a-xxh10",
     *                       "feedback": [],
     *                       "__v": 0,
     *                       "id": "5d4d235d60fbc31e0815d03a"
     *                   },
     *                   "totalPayment": 390000,
     *                   "quantity": 1
     *               }
     *           ],
     *           "__v": 0,
     *           "id": "5d56809a86960171f4b08f89"
     *       }
     *   ]
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *   {  "data": [
     *               {
     *                   "createdDate": "2019-08-16T10:02:35.495Z",
     *                   "updatedAtDate": "2019-08-16T10:10:22.645Z",
     *                   "payments": "Nhận tiền khi giao dịch",
     *                   "statePayment": false,
     *                   "_id": "5d56809a86960171f4b08f89",
     *                   "user": {
     *                       "isDeleted": false,
     *                       "role": "User",
     *                       "_id": "5d56808086960171f4b08f88",
     *                       "username": "nguyenduc",
     *                       "fullName": "Nguyen Duc Hoang",
     *                       "phone": "01659999302",
     *                       "email": "nguyenduchoang@gmail.com",
     *                       "address": "96 Man Thien, Quan 9, Ho Chi Minh",
     *                       "__v": 0,
     *                       "id": "5d56808086960171f4b08f88"
     *                   },
     *                   "stateOrder": "ordered",
     *                   "carts": [
     *                       {
     *                           "_id": "5d56809a86960171f4b08f8a",
     *                           "product": {
     *                               "images": [
     *                                   "products/1565336474005-(460x460)_fm_non_son_mWEB1_2_2.jpg",
     *                                   "products/1565337682692-(460x460)_fm_non_son_mWEB6.jpg",
     *                                   "products/1565337819438-(460x460)_fm_non-son-mWEB1_3_3.jpg"
     *                               ],
     *                               "isDeleted": false,
     *                               "createdAtDate": "2019-08-09T07:35:41.330Z",
     *                               "_id": "5d4d235d60fbc31e0815d03a",
     *                               "productName": "Nón kết",
     *                               "category": "5d4cfbe6c7473c2660edf4a2",
     *                               "currentPrice": 390000,
     *                               "oldPrice": 425000,
     *                               "description": "Vải dù được dệt từ sợi tổng hợp, tùy vào chất liệu, hàm lượng và cách dệt mà vải sẽ có những thuộc tính và chất lượng khác nhau. Vải dù Nón Sơn nhập về được dệt, nhuộm màu bằng công nghệ hiện đại tạo ra màu sắc và chất lượng tuyệt hảo. Vải dù có độ bền cao, nhẹ, thoáng mát, không thấm nước, ít bám bụi, dễ giặt, độ bền màu cao khi tiếp xúc với bức xạ.",
     *                               "title": "Nón kết MC001A-XXH10",
     *                               "sex": 0,
     *                               "textSlug": "non-ket-mc001a-xxh10",
     *                               "feedback": [],
     *                               "__v": 0,
     *                               "id": "5d4d235d60fbc31e0815d03a"
     *                           },
     *                           "totalPayment": 390000,
     *                           "quantity": 1
     *                       }
     *                   ],
     *                   "__v": 0,
     *                   "id": "5d56809a86960171f4b08f89"
     *               }
     *             ],
     *             "message": 'Đặt hàng thành công'
     *    }
     *
     * @apiError NotAuthorization Not authorized.
     * @apiError BadRequest Gửi thất bại. Kiểm tra lại
     * 
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 NotAuthorization
     *     {
     *       "statusCode": 401,
     *       "message": "NotAuthorization" 
     *     },
     *     HTTP/1.2 403 BadRequest
     *     {
     *       "statusCode": 400,
     *       "message": "BadRequest" 
     *     }
     */
    @httpPost('/confirm/order', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    public async confirmOrders(req: any, res: Response) {
        try {
            const user = await this.userRepo.findOne({ _id: req.body.user });
            req.body.updatedAtDate = new Date(Date.now());
            const orderUpdated = await this.orderRepo.update(req.body);
            let notify;
            if (orderUpdated) {
                notify = 'Đang đóng gói sản phẩm và chuẩn bị giao cho đơn vị giao hàng !';
            }
            const content = {
                user,
                order: req.body,
                notify
            };
            const result = await email.sendEmail(user.email as string, content);
            if (result) {
                return res.status(200).send({ data: orderUpdated, message: 'Đặt hàng thành công' });
            }
            return res.status(400).send('Gửi thất bại. Kiểm tra lại');
        } catch (error) {
            throw error;
        }
    }

    @httpPost('/', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    public async createOrder(req: any, res: Response) {
        try {
            // body => {product, quantity}
            const cart: ICart = {
                product: req.body.product.id,
                totalPayment: req.body.product.currentPrice * req.body.quantity,
                quantity: req.body.quantity
            };
            const order: IOrder = {
                user: req.user.id,
                stateOrder: 'not-ordered',
                createdDate: new Date(Date.now())
            };
            const created = await this.orderRepo.create(order);
            const data = await this.orderRepo.pushCart(created.id as string, cart);
            return res.status(200).send(data);
        } catch (error) {
            throw error;
        }

    }

    @httpPut('/', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    public async updateOrder(req: any, res: Response) {
        try {
            // body => {product, quantity}
            const product: IProduct = req.body.product;
            const order = await this.orderRepo.findOne({ user: req.user.id, statePayment: false, stateOrder: 'not-ordered' });
            if (order) {
                let carts = order.carts as ICart[];
                const index = carts.findIndex(p => p.product == product.id);
                if (index !== -1) {
                    if (+req.body.quantity > 0) {
                        carts[index].quantity = req.body.quantity;
                        carts[index].totalPayment = (product.currentPrice as number) * req.body.quantity;
                        await this.orderRepo.pullCart(order.id as string, carts[index].id);
                        const data = await this.orderRepo.pushCart(order.id as string, carts[index]);
                        return res.status(200).send(data);
                    } else {
                        const data = await this.orderRepo.pullCart(order.id as string, carts[index].id);
                        return res.status(200).send(data);
                    }
                } else {
                    const cart: ICart = {
                        product: req.body.product.id,
                        totalPayment: req.body.product.currentPrice * req.body.quantity,
                        quantity: req.body.quantity
                    };
                    const data = await this.orderRepo.pushCart(order.id as string, cart);
                    return res.status(200).send(data);
                }
            }
            return res.status(404).send({ message: 'Giỏ hàng không tồn tại. Kiểm tra lại!' });
        } catch (error) {
            throw error;
        }
    }

    @httpPut('/state/:id', parser([constants.ROLES.ADMIN]))
    public async updateStateOrder(req: Request, res: Response) {
        try {
            const orderId = req.params.id;
            let query = {};
            if (req.body.state === 'completed') {
                query = { stateOrder: req.body.state, statePayment: true };
            } else {
                query = { stateOrder: req.body.state };
            }
            const updated = await this.orderRepo.updateState(orderId, query);
            const user = await this.userRepo.findOne({ _id: req.body.order.user });
            if (updated) {
                let notify = '';
                if (req.body.state == 'ordered') {
                    notify = 'Đang đóng gói sản phẩm và chuẩn bị giao cho đơn vị giao hàng !';
                }
                if (req.body.state == 'delivered') {
                    notify = 'Sản phẩm đã được đóng gói và đang trên đường chuyển hàng !';
                }
                if (req.body.state == 'completed') {
                    notify = 'Sản phẩm đã được giao đến khách hàng !';
                }
                const content = {
                    user,
                    order: req.body.order,
                    notify: notify
                };
                const result = await email.sendEmail(user.email as string, content);
                const respon = await this.orderRepo.findOnePopulate({ _id: orderId });
                if (updated && result) {
                    return res.status(200).send(respon);
                }
                return res.status(400).send({ statusCode: 400, message: 'Gửi mail thất bại' });
            }
            return res.status(400).json({ statusCode: 400, message: 'Cập nhật không thành công. Kiểm tra lại thông tin' });
        } catch (error) {
            throw error;
        }
    }

    @httpPut('/delete', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    public async delete(req: any, res: Response) {
        try {
            const product: IProduct = req.body;
            const order = await this.orderRepo.findOne({ user: req.user.id, stateOrder: 'not-ordered', statePayment: false });
            if (order) {
                let carts = order.carts as ICart[];
                const index = carts.findIndex(p => p.product == product.id);
                if (index !== -1) {
                    const data = await this.orderRepo.pullCart(order.id as string, carts[index].id);
                    return res.status(200).send(data);
                }
            }
            return res.status(500).send({ message: 'Giỏ hàng không tồn tại. Kiểm tra lại!' });
        } catch (error) {
            throw error;
        }
    }

    @httpDelete('/delete/ordered/:orderID', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    public async removeOrdered(@requestParam('orderID') orderID: string, @response() res: express.Response) {
        try {
            const result = await this.orderRepo.removeOrdered(orderID as string);
            if (result) {
                return res.status(200).send({ statusCode: 200, message: 'Đã xóa đơn hàng thành công!' });
            } else {
                return res.status(400).json({ statusCode: 400, message: 'Xóa thất bại. Kiểm tra lại' });
            }
        } catch (error) {
            throw error;
        }
    }


    @httpGet('/', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    public async getOrderCart(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const order = await this.orderRepo.findOnePopulate({ user: userId, statePayment: false, stateOrder: 'not-ordered' });
            if (order) {
                return res.status(200).send({ order, cartEmpty: false });
            }
            return res.status(200).json({ cartEmpty: true });
        } catch (error) {
            throw error;
        }
    }

    @httpGet('/orderbyid/:id', parser([constants.ROLES.ADMIN]))
    public async getOrderById(req: Request, res: Response) {
        try {
            const order = await this.orderRepo.findOnePopulate({ _id: req.params.id });
            if (order) {
                return res.status(200).send(order);
            }
            return res.status(404).json({ statusCode: 404, message: 'Đơn hàng không tồn tại' });
        } catch (error) {
            throw error;
        }
    }

    @httpGet('/filter', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    public async getOrderWithFilter(req: any, res: Response) {
        try {
            const { stateOrder, statePayment } = req.query;
            let query;
            if (req.user.role === 'User') {
                query = stateOrder === 'all' ? { user: req.user.id } : { user: req.user.id, statePayment: statePayment, stateOrder: stateOrder };
            } else {
                query = stateOrder === 'all' ? {} : { statePayment: statePayment, stateOrder: stateOrder };
            }
            const order = await this.orderRepo.findWithFilter(query);
            if (order.length > 0) {
                return res.status(200).send({ order, cartEmpty: false });
            }
            return res.status(200).json({ cartEmpty: true });
        } catch (error) {
            throw error;
        }
    }

}