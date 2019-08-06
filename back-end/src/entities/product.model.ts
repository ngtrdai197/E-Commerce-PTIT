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
    images?: string[];
    category?: string | ICategory;
    productTotal?: number;
    textSlug?: string;
    // discount?: number;
    // productAvailable?: number;
    ratings?: number; // ratings
    sex?: number; // 0 male 1 female
    feeback?: IFeedback,
    isDeleted?: boolean
}

export interface IFeedback {
    customer?: string | IUser;
    content?: string;
}

export interface IProductModel extends IProduct, mongoose.Document {
    id: string;
}


const feedbackSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAtDate: {
        type: Date,
        default: new Date(Date.now())
    }
});

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
        textSlug: {
            type: String,
            required: true
        },
        // discount:{
        //     type: Number,
        //     required: true
        // },
        // productAvailable: {
        //     type: Number,
        //     required: true
        // },
        ratings: {
            type: Number
        },
        sex: {
            type: Number,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        feedback: [feedbackSchema]
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
