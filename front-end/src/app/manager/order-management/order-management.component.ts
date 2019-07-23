import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderCartService } from 'src/@core/services/order-cart.service';

@Component({
  selector: 'shop-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {

  orderState = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private orderCartService: OrderCartService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.orderState = params['status'];
      this.onTakeDataFilterState();
    });
  }

  onTakeDataFilterState() {
    const state = this.orderState == true ? 0 : 1;
    this.orderCartService.getOrdersWithFilter(state).subscribe(data => {
      console.log(data);
    });
  }

}
