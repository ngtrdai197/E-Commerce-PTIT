import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { IOrder } from 'src/@core/interface/IOrder.interface';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'shop-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {

  orders: IOrder[] = [];
  cartEmpty = false;
  actionFilter = '';
  currentOrderId = '';
  constructor(
    private activatedRoute: ActivatedRoute, private title: Title,
    private orderCartService: OrderCartService, private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.title.setTitle('Quản lý đơn hàng');
    this.activatedRoute.params.subscribe(params => {
      this.spinner.show();
      this.actionFilter = params['state'];
      this.onTakeDataFilterState(params['state']);
    });
  }

  onTakeDataFilterState(state: string) {
    if (this.actionFilter === 'completed') {
      this.orderCartService.getOrdersWithFilter(state, true).subscribe(data => {
        if (data) {
          this.orders = data.order;
          this.cartEmpty = data.cartEmpty;
          this.spinner.hide();
        }
      });
    } else {
      this.orderCartService.getOrdersWithFilter(state, false).subscribe(data => {
        if (data) {
          this.orders = data.order;
          this.cartEmpty = data.cartEmpty;
          this.spinner.hide();
        }
      });
    }
  }
}
