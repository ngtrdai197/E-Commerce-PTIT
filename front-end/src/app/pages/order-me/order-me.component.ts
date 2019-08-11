import { Component, OnInit } from '@angular/core';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'shop-order-me',
  templateUrl: './order-me.component.html',
  styleUrls: ['./order-me.component.scss']
})
export class OrderMeComponent implements OnInit {

  actionOrder = 'all';
  orders: any;
  constructor(private orderCartService: OrderCartService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.onFilterOrder(this.actionOrder);
  }

  onFilterOrder(action: string) {
    this.spinner.show();
    if (action === 'completed') {
      this.orderCartService.getOrdersWithFilter(action, true).subscribe(data => {
        this.orders = data;
        this.spinner.hide();
      });
    } else {
      this.orderCartService.getOrdersWithFilter(action, false).subscribe(data => {
        this.orders = data;
        this.spinner.hide();
      });
    }
  }
}
