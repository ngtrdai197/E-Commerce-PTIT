import * as mongoose from "mongoose";
import { ICategory } from "./index";
import { IUser } from "./user.model";

export interface IProduct {
    id?: string;
    productName?: string;
    title?: string;
    description?: string;
    currentPrice?: number
    oldPrice?: number;
    discount?: number;
    images?: string[];
    category?: string | ICategory;
    productTotal?: number;
    productAvailable?: number;
    ratings?: number; // ratings
    sex?: number; // 0 male 1 female
    productBoughtBy?: Customer;
}

export interface Customer {
    customer?: string | IUser;
    boughtAtDate?: Date;
}

export interface IProductModel extends IProduct, mongoose.Document {
    id: string;
}

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        currentPrice: {
            type: Number,
            required: true
        },
        description: String,
        oldPrice: Number,
        discount: Number,
        images: [{
            type: String
        }],
        category: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Category',
            required: true
        },
        productTotal: {
            type: Number,
            required: true
        },
        productAvailable: {
            type: Number,
            required: true
        },
        ratings: {
            type: Number
        },
        sex: {
            type: Number,
            required: true
        },
        productBoughtBy: new mongoose.Schema({
            customerId: {
                type: mongoose.Schema.Types.ObjectId, ref: 'User',
                required: true
            },
            boughtAtDate: {
                type: Date,
                required: true
            }
        })
    },
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }
);
productSchema.virtual("id").get(function (this: any) {
    return this._id.toHexString();
});

export const productModel = mongoose.model<IProductModel>("Product", productSchema);
