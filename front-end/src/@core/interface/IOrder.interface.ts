import { IUser, IProduct, IAMount } from './index';

export interface IOrder {
    id?: string;
    createdDate?: string | Date;
    updatedAtDate?: string | Date;
    completedDate?: string | Date;
    payments?: string; // hình thức thanh toán
    statePayment?: boolean; // trạng thái thanh toán
    stateOrder?: string; // trang thai don hang
    carts?: ICart[];
    user?: string | IUser;
}

export interface ICart {
    id?: string;
    quantity?: number;
    totalPayment?: number;
    product?: string | IProduct;
}