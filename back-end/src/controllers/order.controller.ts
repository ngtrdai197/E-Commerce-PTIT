import { controller, httpPost, httpGet, httpPut } from "inversify-express-utils";
import { Response, Request } from "express";
import { inject } from "inversify";
import { TYPES, constants } from "../common";
import { IOrderRepository, IUserRepository } from "../IRepositories";
import { parser } from "../middleware";
import { ICart, IOrder, IProduct } from "../entities";
import { email } from "../common/email";

@controller('/order')
export class OrderController {
    constructor(
        @inject(TYPES.IOrderRepository) private orderRepo: IOrderRepository,
        @inject(TYPES.IUserRepository) private userRepo: IUserRepository
    ) { }

    @httpGet('/search', parser([constants.ROLES.ADMIN]))
    public async searchOrder(req: Request, res: Response) {
        try {
            const user = await this.userRepo.findOne({ phone: req.query.keyword });
            if (!user) return res.status(400).json({ statusCode: 400, message: 'Không tìm thấy đơn theo số điện thoại' });
            const query = {
                user: user.id,
                updatedAtDate: { "$gte": new Date(req.query.date), "$lt": new Date(req.query.tomorrow) },
                stateOrder: req.query.stateOrder
            };
            const ordered = await this.orderRepo.findWithFilter(query);
            if (ordered) {
                return res.status(200).send(ordered);
            }
            return res.status(400).json({ statusCode: 400, message: 'Không tìm thấy đơn' });
        } catch (error) {
            return res.status(500).json({ statusCode: 500, message: error.message });
        }
    }

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
            return res.status(500).send({ message: error.message });
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
                stateOrder: 'not-ordered'
            };
            const created = await this.orderRepo.create(order);
            const data = await this.orderRepo.pushCart(created.id as string, cart);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send({ message: error.message });
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
            return res.status(500).send({ message: error.message });
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
            return res.status(500).json({ statusCode: 500, message: error.message });
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
            return res.status(500).send({ message: error.message });
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