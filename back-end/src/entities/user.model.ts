import * as mongoose from "mongoose";
import { IOrderDetails } from "./order-details.model";

export interface IUser {
  id?: string;
  username?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  role?: string;
  address?: string;
  avatar?: string;
  orderDetails?: string | IOrderDetails;
}

export interface IUserModel extends IUser, mongoose.Document {
  id: string;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "User"
    },
    address: String,
    avatar: String,
    orderDetails: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'OrderDetails' }
    ]
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
userSchema.virtual("id").get(function (this: any) {
  return this._id.toHexString();
});

export const userModel = mongoose.model<IUserModel>("user", userSchema);
