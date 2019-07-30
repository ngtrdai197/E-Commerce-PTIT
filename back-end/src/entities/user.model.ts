import * as mongoose from "mongoose";
import { IOrder } from "./order.model";

export interface IUser {
  id?: string;
  username?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  role?: string;
  address?: string;
  isDeleted?: boolean;
  avatar?: string;
  orders?: string[] | IOrder[];
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
    isDeleted: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "User"
    },
    address: {
      type: String,
      required: true
    },
    avatar: String,
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }]
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

export const userModel = mongoose.model<IUserModel>("User", userSchema);
