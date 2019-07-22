import { controller, httpPost, httpGet, httpPut } from "inversify-express-utils";
import { Response } from "express";
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
            console.log(req.body);

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
                stateOrder: -1
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
            const order = await this.orderRepo.findOne({ user: req.user.id, statePayment: false, stateOrder: { $lt: 0 } });
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
            return res.status(500).send({ message: 'Giỏ hàng không tồn tại. Kiểm tra lại!' });
        } catch (error) {
            return res.status(500).send({ message: error.message });
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
            const order = await this.orderRepo.findOnePopulate({ user: userId, statePayment: false, stateOrder: { $lt: 0 } });
            if (order) {
                return res.status(200).send({ order, cartEmpty: false });
            }
            return res.status(200).json({ cartEmpty: true });
        } catch (error) {
            throw error;
        }
    }
}