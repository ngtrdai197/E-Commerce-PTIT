import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { IOrder } from 'src/@core/interface/IOrder.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'shop-order-details-management',
  templateUrl: './order-details-management.component.html',
  styleUrls: ['./order-details-management.component.scss']
})
export class OrderDetailsManagementComponent implements OnInit {

  order: IOrder;
  totalPayment = 0;
  valueStateOrder = '';
  isLoading = false;
  orderCompleted = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private orderCartService: OrderCartService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.orderCartService.getOrderById(params['orderId']).subscribe(response => {
        this.order = response;
        this.totalPayment = 0;
        if (response) {
          this.order.carts.map((x: any) => {
            this.totalPayment += x.totalPayment;
          });
          this.isLoading = true;
        }
      });
    })
  }

  getValueSelect(value: string) {
    this.valueStateOrder = value;
  }

  updateOrder(order: IOrder) {
    this.spinner.show();
    this.valueStateOrder = this.valueStateOrder ? this.valueStateOrder : order.stateOrder;
    this.orderCartService.updateStateOrder(order, this.valueStateOrder).subscribe(response => {
      if (response) {
        this.order = response;
        this.totalPayment = 0;
        this.order.carts.map((x: any) => {
          this.totalPayment += x.totalPayment;
        });
        this.toast.success('Cập nhật trạng thái đơn hàng thành công');
        this.isLoading = true;
        this.spinner.hide();
      }
    }, (error) => {
      console.log(error);
      this.toast.error(`${error.error}`);
    });
  }

}
