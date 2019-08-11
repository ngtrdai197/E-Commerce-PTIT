import * as mongoose from 'mongoose';
import { IProduct } from './product.model';
import { IUser } from './user.model';

export interface IOrder {
    id?: string;
    createdDate?: string | Date;
    completedDate?: string | Date;
    payments?: string; // hình thức thanh toán
    statePayment?: boolean; // trạng thái thanh toán
    stateOrder?: string;
    user?: string | IUser;
    carts?: string[] | ICart[];
}

export interface IOrderModel extends IOrder, mongoose.Document {
    id: string;
}

export interface ICart {
    id?: string;
    quantity?: number; // so luong dat cua san pham
    totalPayment?: number; // so tien phai thanh toan
    product?: string | IProduct; // san pham
}

const cartSchema = new mongoose.Schema({
    quantity: { type: Number,required: true },
    totalPayment: {type: Number, required: true},
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
})

export const orderSchema = new mongoose.Schema({
    createdDate: { type: Date, default: new Date },
    completedDate: Date,
    payments: { type: String, default: "Nhận tiền khi giao dịch" },
    stateOrder: { type: String },
    statePayment: { type: Boolean, default: false },
    carts: [cartSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
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

export const orderModel = mongoose.model<IOrderModel>("Order", orderSchema);