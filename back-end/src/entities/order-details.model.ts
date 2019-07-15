import * as mongoose from 'mongoose';
import { IProduct, IOrder, IUser } from './index';

export interface IOrderDetails {
    id?: string;
    product?: string | IProduct;
    order?: string | IOrder;
    user?: string | IUser;
    quantity?: number;
}

export interface IOrderDetailsModel extends IOrderDetails, mongoose.Document {
    id: string;
}

export const orderDetailSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: {
        type: Number,
        required: true
    },
}, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    })

orderDetailSchema.virtual("id").get(function (this: any) {
    return this._id.toHexString();
});

export const orderDetailModel = mongoose.model<IOrderDetailsModel>("orderDetail", orderDetailSchema);