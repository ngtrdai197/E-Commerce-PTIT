import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { IOrder } from 'src/@core/interface/IOrder.interface';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { SearchService } from 'src/@core/services/search.service';
import { ToastrService } from 'ngx-toastr';

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
  maxDate = new Date(Date.now());
  selectedDate: any;
  constructor(
    private activatedRoute: ActivatedRoute, private title: Title,
    private orderCartService: OrderCartService, private spinner: NgxSpinnerService,
    private searchService: SearchService, private toast: ToastrService
  ) { }

  ngOnInit() {
    this.title.setTitle('Quản lý đơn hàng');
    this.activatedRoute.params.subscribe(params => {
      this.spinner.show();
      this.actionFilter = params['state'];
      this.onTakeDataFilterState(params['state']);
    });
  }

  onShowAll() {
    this.spinner.show();
    this.onTakeDataFilterState(this.actionFilter);
  }

  onSearchOrder(keyword: string) {
    const tomorrow = moment(new Date(this.selectedDate)).add(1, 'days').format('YYYY-MM-DD');
    const date = moment(new Date(this.selectedDate)).format('YYYY-MM-DD')
    if (keyword && this.selectedDate) {
      this.spinner.show();
      this.searchService.searchWithOrder(keyword, date, tomorrow, this.actionFilter).subscribe(data => {
        this.orders = data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toast.error(error.error.message);
      });
    } else {
      this.toast.warning('Vui lòng nhập đầy đủ thông tin');
      return;
    }
  }
  onSelectDate(event) {
    this.selectedDate = event.value;
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
