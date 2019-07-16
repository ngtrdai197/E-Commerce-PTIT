import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { IProduct, ICart } from '../interface';

@Injectable({
    providedIn: "root"
})

export class OrderCartService {

    private orders = new BehaviorSubject<any>(null);
    ordereLocal = localStorage.getItem('orderLocal');
    constructor() {
        this.getLocalStorage();
    }

    get orderCart() {
        return this.orders.asObservable();
    }

    increment(product: IProduct) {
        let carts: IProduct[] = [];
        if (this.orders.getValue() as IProduct[]) {
            carts = (this.orders.getValue().products) as IProduct[];
            const index = carts.findIndex(p => p.id === product.id);
            if (index != -1) {
                (carts[index].order.quantityOrder)++;
            } else {
                const order: ICart = {
                    quantityOrder: 1,
                    totalPayment: 0
                }
                product.order = order;
                carts.push(product);
            }
        } else {
            const order: ICart = {
                quantityOrder: 1,
                totalPayment: 0
            }
            product.order = order;
            carts.push(product);
        }

        this.orders.next({
            order: this.totalMoney(carts),
            products: carts
        });
        this.setLocalStorage();
    }

    decrement(product: IProduct) {
        let carts = (this.orders.getValue().products) as IProduct[];
        const index = carts.findIndex(p => p.id === product.id);
        if (index != -1) {
            carts[index].order.quantityOrder > 1 ? (carts[index].order.quantityOrder)-- : carts.splice(index, 1);
        }
        this.orders.next({
            order: this.totalMoney(carts),
            products: carts
        });
        this.setLocalStorage();
    }

    removeItem(product: IProduct) {
        let carts = (this.orders.getValue().products) as IProduct[];
        const index = carts.findIndex(p => p.id === product.id);
        if (index != -1) {
            carts.splice(index, 1);
        }
        this.orders.next({
            order: this.totalMoney(carts),
            products: carts
        });
        this.setLocalStorage();
    }

    private setLocalStorage() {
        if ((this.orders.getValue().products as []).length > 0) {
            localStorage.removeItem('orderLocal');
            localStorage.setItem('orderLocal', JSON.stringify(this.orders.getValue()));
        } else {
            localStorage.removeItem('orderLocal');
        }
    }

    private getLocalStorage() {
        if (this.ordereLocal) {
            this.orders.next(JSON.parse(localStorage.getItem('orderLocal')));
        } else {
            this.orders.next(null);
        }
    }

    private totalMoney(products: IProduct[]) {
        let payment: number = 0;
        let quantity: number = 0;
        for (let item of products) {
            payment += ((item.currentPrice) * (item.order.quantityOrder));
            quantity += (item.order.quantityOrder);
        }
        const order: any = {
            quantity: quantity,
            totalPayment: payment
        };
        return order;
    }

}
