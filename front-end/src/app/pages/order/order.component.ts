import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { Title } from '@angular/platform-browser';
import { IUser } from 'src/@core/interface';
import { JwtService } from 'src/@core/services/jwt.service';
import { IOrder } from 'src/@core/interface/IOrder.interface';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'shop-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  order: any;
  currentUser: IUser;
  totalPayment = 0;
  subscription: Subscription;
  constructor(private title: Title,
    private orderCartService: OrderCartService, private jwtService: JwtService,
    private toast: ToastrService

  ) { }

  ngOnInit() {
    this.onSetTitle();
    this.subscription = this.orderCartService.orderCart.subscribe((data: IOrder) => {
      this.order = data;
      this.totalPayment = 0;
      if (data) {
        this.order.carts.map((x: any) => {
          this.totalPayment += x.totalPayment;
        });
      }
    });
    this.jwtService.getProfile.subscribe(data => this.currentUser = data);
  }

  confirmOrder() {
    this.orderCartService.confirmOrder(this.order).subscribe(data => {
      if (data) {
        this.toast.success(data.message);
      }
    }, err => console.log(err));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSetTitle() {
    this.title.setTitle('Trang đặt hàng - Order');
  }
}
