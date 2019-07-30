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

    @httpPost('/confirm/order', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    public async confirmOrders(req: any, res: Response) {
        try {
            const user = await this.userRepo.findOne({ _id: req.body.user });
            const orderUpdated = await this.orderRepo.update(req.body);
            const content = {
                user,
                order: req.body
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
            //update order to user
            // const user = await this.userRepo.findOne(req.user.id);
            // const orders = [];
            // orders.push(created.id);
            // (user.orders as string[]) = orders as string[];
            // await this.userRepo.update(user);
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
            if (updated) {
                const order = await this.orderRepo.findOne({ _id: orderId });
                return res.status(200).send(order);
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
            const order = await this.orderRepo.findOne({ user: req.user.id, statePayment: false });
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

    @httpGet('/filter', parser([constants.ROLES.ADMIN]))
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