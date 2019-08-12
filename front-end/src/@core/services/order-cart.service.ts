import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { API } from "../config/API";
import { tap, map } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';
import { IOrder } from '../interface/IOrder.interface';
import { IProduct } from '../interface';

@Injectable({
    providedIn: "root"
})
export class OrderCartService {
    private orders = new BehaviorSubject<any>(null);
    ordereLocal = localStorage.getItem("orderLocal");
    constructor(private http: HttpClient, private toast: ToastrService, private spinner: NgxSpinnerService) {
        // this.getOrdersCart();
    }

    confirmOrder(order: any): Observable<any> {
        order.stateOrder = 'ordered';
        return this.http.post(`${API.HOST}/${API.ORDER.BASE}/confirm/order`, order);
    }

    get orderCart() {
        return this.orders.asObservable();
    }

    removeCart() {
        this.orders.next(null);
    }

    checkCart(): Observable<any> {
        return this.http.get(`${API.HOST}/${API.ORDER.BASE}`);
    }

    removeItem(product: IProduct) {
        this.http.put(`${API.HOST}/${API.ORDER.BASE}/delete`, product).pipe(
            tap(response => {
                if (response) {
                    response['carts'].map(order => {
                        order.product.images = order.product.images.map((img: string) => {
                            return (img = `${API.HOST}/${img}`);
                        });
                    });
                }
            })
        ).subscribe(data => {
            this.spinner.hide();
            this.orders.next(data);
            this.toast.success('Đã cập nhật giỏ hàng.');
        });
    }

    createCart(order: any) {
        this.http
            .post(`${API.HOST}/${API.ORDER.BASE}`, order)
            .pipe(
                tap(transform => {
                    if (transform) {
                        transform['carts'].map(order => {
                            order.product.images = order.product.images.map((img: string) => {
                                return (img = `${API.HOST}/${img}`);
                            });
                        });
                    }
                })
            ).subscribe((data) => {
                this.spinner.hide();
                this.orders.next(data);
                this.toast.success('Đã cập nhật giỏ hàng.');
            });
    }

    updateCart(order: any) {
        this.http.put(`${API.HOST}/${API.ORDER.BASE}`, order).pipe(
            tap(transform => {
                if (transform) {
                    transform['carts'].map(order => {
                        return order.product.images = order.product.images.map((img: string) => {
                            return (img = `${API.HOST}/${img}`);
                        });
                    });
                }
            })
        ).subscribe(data => {
            this.spinner.hide();
            this.orders.next(data);
            this.toast.success('Đã cập nhật giỏ hàng.');
        });
    }

    getOrderById(orderId: string): Observable<IOrder> {
        return this.http.get<IOrder>(`${API.HOST}/${API.ORDER.BASE}/orderbyid/${orderId}`).pipe(tap(response => {
            if (response) {
                response.carts.map(order => {
                    order.product['images'] = order.product['images'].map(img => {
                        return (img = `${API.HOST}/${img}`);
                    });
                });
            }
        }))
    }

    getOrdersCart() {
        this.http
            .get(`${API.HOST}/${API.ORDER.BASE}`)
            .pipe(
                tap(transform => {
                    if (!transform['cartEmpty']) {
                        transform["order"].carts.map(order => {
                            order.product.images = order.product.images.map(img => {
                                return (img = `${API.HOST}/${img}`);
                            });
                        });
                    }
                })
            )
            .subscribe(data => {
                this.orders.next(data["order"]);
            });
    }

    getOrdersWithFilter(state: string, payment: boolean): Observable<any> {
        return this.http
            .get(`${API.HOST}/${API.ORDER.BASE}/filter?stateOrder=${state}&statePayment=${payment}`)
            .pipe(
                tap(transform => {
                    if (!transform['cartEmpty']) {
                        transform["order"].map((order: any) => {
                            order.carts.map((cart: any) => {
                                if (cart.product.images) {
                                    cart.product.images = cart.product.images.map((img: string) => {
                                        return (img = `${API.HOST}/${img}`);
                                    });
                                }
                                return cart;
                            });
                        });
                    }
                })
            );
    }

    updateStateOrder(order: IOrder, state: string): Observable<IOrder> {
        const body = { state, order };
        return this.http.put<IOrder>(`${API.HOST}/${API.ORDER.BASE}/state/${order.id}`, body).pipe(tap(response => {
            if (response) {
                response.carts.map(order => {
                    order.product['images'] = order.product['images'].map(img => {
                        return (img = `${API.HOST}/${img}`);
                    });
                });
            }
        }));
    }
}
