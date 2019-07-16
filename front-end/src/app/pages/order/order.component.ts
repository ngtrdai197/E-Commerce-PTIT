import { Component, OnInit } from '@angular/core';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'shop-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  order: any;
  constructor(private title: Title, private orderCartService: OrderCartService) { }

  ngOnInit() {
    this.onSetTitle();
    this.orderCartService.orderCart.subscribe(data => {
      this.order = data;
      console.log(this.order);
    });
  }


  onSetTitle() {
    this.title.setTitle('Trang đặt hàng - Order');
  }
}
