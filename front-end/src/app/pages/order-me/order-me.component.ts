import { Component, OnInit } from '@angular/core';
import { OrderCartService } from 'src/@core/services/order-cart.service';

@Component({
  selector: 'shop-order-me',
  templateUrl: './order-me.component.html',
  styleUrls: ['./order-me.component.scss']
})
export class OrderMeComponent implements OnInit {

  actionOrder = 'all';
  orders: any;
  constructor(private orderCartService: OrderCartService) { }

  ngOnInit() {
    this.onFilterOrder(this.actionOrder);
  }

  onFilterOrder(action: string) {
    console.log(action);
    if (action === 'completed') {
      this.orderCartService.getOrdersWithFilter(action, true).subscribe(data => {
        this.orders = data;
        console.log(data);
      });
    } else {
      this.orderCartService.getOrdersWithFilter(action, false).subscribe(data => {
        this.orders = data;
        console.log(data);
      });
    }

  }
}
