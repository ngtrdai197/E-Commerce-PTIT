import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { IProduct } from '../interface';

@Injectable({
    providedIn: "root"
})

export class OrderCartService {

    private orders = new BehaviorSubject<any>(null);

    constructor() { }

    get orderCart() {
        return this.orders.asObservable();
    }

    increment(product: IProduct) {
        let carts: IProduct[] = [];
        if ((this.orders.getValue() as IProduct[])) {
            this.orders.getValue() as IProduct[]
        } else {
            carts.push(product);
        }
        const index = carts.findIndex(p => p.id === product.id);
        if (index != -1) {
            (carts[index].order.quantityOrder as number)++;
        } else {
            (product.order.quantityOrder as number) = 1;
            carts.push(product);
        }
        console.log(carts);

        const order = {
            order: this.totalMoney(carts),
            products: carts
        };
        this.orders.next(order as any);
    }

    decrement(product: IProduct) {
        let carts = this.orders.getValue() as IProduct[];
        const index = carts.findIndex(p => p.id === product.id);
        if (index != -1) {
            carts[index].order.quantityOrder > 1 ? (carts[index].order.quantityOrder as number)-- : carts.splice(index, 1);
        }
        const order = this.totalMoney(carts);
        this.orders.next(order);
    }

    private totalMoney(products: IProduct[]) {
        let payment: number = 0;
        let quantity: number = 0;
        for (let item of products) {
            payment += ((item.currentPrice as number) * (item.order.quantityOrder as number));
            quantity += (item.order.quantityOrder as number);
        }
        const order: any = {
            quantity: quantity,
            totalPayment: payment
        };
        return order;
    }

}
