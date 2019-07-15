import * as mongoose from 'mongoose';
import { IProduct } from './index';

export interface ICategory {
    id?: string;
    categoryName?: string;
    products?: string[] | IProduct[];
}

export interface ICategoryModel extends ICategory, mongoose.Document {
    id: string;
}
export const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    products: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    ]

},
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    })

categorySchema.virtual("id").get(function (this: any) {
    return this._id.toHexString();
});

export const categoryModel = mongoose.model<ICategoryModel>("category", categorySchema);