import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { IOrder } from 'src/@core/interface/IOrder.interface';
import { IUser } from 'src/@core/interface';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'shop-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {

  orderDetailsForm: FormGroup;
  orders: IOrder[] = [];
  cartEmpty = false;
  actionFilter = '';
  currentOrderId = '';
  constructor(
    private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private title: Title,
    private orderCartService: OrderCartService, private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.title.setTitle('Quản lý đơn hàng');
    this.buildForm();
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
        console.log(data);
      });
    } else {
      this.orderCartService.getOrdersWithFilter(state, false).subscribe(data => {
        if (data) {
          this.orders = data.order;
          this.cartEmpty = data.cartEmpty;
          this.spinner.hide();
        }
        console.log(data);
      });
    }

  }

  updateOrder() {
    this.orderCartService.updateStateOrder(this.currentOrderId, this.orderDetailsForm.value.stateOrder).subscribe(data => {
      if (data) {
        this.onTakeDataFilterState(this.actionFilter);
      }
    });
  }
  onShowOrderDetails(order: IOrder) {
    this.currentOrderId = order.id;
    this.orderDetailsForm = this.formBuilder.group({
      payments: [order.payments, Validators.required],
      stateOrder: [order.stateOrder, Validators.required],
      statePayment: [order.statePayment ? 'Đã thanh toán' : 'Chưa thanh toán', Validators.required],
      address: [(order.user as IUser).address, Validators.required],
      fullName: [(order.user as IUser).fullName, Validators.required],
      email: [(order.user as IUser).email, Validators.required],
      phone: [(order.user as IUser).phone, Validators.required],
      productName: ['', Validators.required],
      quantity: ['', Validators.required],
      totalPayment: ['', Validators.required],
    })
  }

  private buildForm() {
    this.orderDetailsForm = this.formBuilder.group({
      payments: ['', Validators.required],
      stateOrder: ['', Validators.required],
      statePayment: ['', Validators.required],
      address: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      productName: ['', Validators.required],
      quantity: ['', Validators.required],
      totalPayment: ['', Validators.required],
    })
  }

}
