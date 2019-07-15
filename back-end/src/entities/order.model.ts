import * as mongoose from 'mongoose';
import { IOrderDetails } from './index';

export interface IOrder {
    id?: string;
    createdDate?: string | Date;
    payments?: string;
    total?: number;
    statePayment?: boolean;
    orderDetails?: string | IOrderDetails
}

export interface IOrderModel extends IOrder, mongoose.Document {
    id: string;
}

export const orderSchema = new mongoose.Schema({
    createdDate: {
        type: Date,
        default: new Date
    },
    payments: {
        type: String,
        default: "Nhận tiền khi giao dịch"
    },
    total: {
        type: Number,
        required: true
    },
    statePayment: {
        type: Boolean,
        default: false
    },
    orderDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: 'OrderDetails',
        required: true
    }
},
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    })

orderSchema.virtual("id").get(function (this: any) {
    return this._id.toHexString();
});

export const orderModel = mongoose.model<IOrderModel>("order", orderSchema);