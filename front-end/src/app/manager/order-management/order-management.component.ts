import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
      payments: new FormControl(order.payments, Validators.required),
      stateOrder: new FormControl(order.stateOrder, Validators.required),
      statePayment: new FormControl(order.statePayment ? 'Đã thanh toán' : 'Chưa thanh toán', Validators.required),
      address: new FormControl((order.user as IUser).address, Validators.required),
      fullName: new FormControl((order.user as IUser).fullName, Validators.required),
      email: new FormControl((order.user as IUser).email, Validators.required),
      phone: new FormControl((order.user as IUser).phone, Validators.required),
      productName: new FormControl('', Validators.required),
      totalPayment: new FormControl('', Validators.required),
    })
  }

  private buildForm() {
    this.orderDetailsForm = this.formBuilder.group({
      payments: new FormControl('', Validators.required),
      stateOrder: new FormControl('', Validators.required),
      statePayment: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      productName: new FormControl('', Validators.required),
      totalPayment: new FormControl('', Validators.required),
    })
  }

}
