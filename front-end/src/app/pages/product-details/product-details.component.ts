import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/@core/services/product.service';
import { IProduct, IFeedback, IUser } from 'src/@core/interface';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { API } from 'src/@core/config/API';
import { JwtService } from 'src/@core/services/jwt.service';

@Component({
  selector: 'shop-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  slides: any = [[]];
  relatedProduct: IProduct[] = [];
  product: IProduct;
  feedbacks: IFeedback[];
  count = 0;
  isLogin = localStorage.getItem('x-access-token');
  feedbackForm: FormGroup;
  role = API.ROLES;
  currentUser: IUser;
  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService, private spinner: NgxSpinnerService,
    private orderCartService: OrderCartService, private toast: ToastrService,
    private formBuilder: FormBuilder, private jwtService: JwtService
  ) { }


  ngOnInit() {
    this.spinner.show();
    this.jwtService.getProfile.subscribe(data => this.currentUser = data);
    this.activatedRoute.params.subscribe(params => {
      this.onLoadProduct(params['id']);
      this.orderCartService.orderCart.subscribe(data => {
        if (data) {
          const index = data.carts.findIndex(x => x.product.id === params['id']);
          this.count = index != -1 ? data.carts[index].quantity : 0;
        }
      });
    });
    this.buildForm();
  }

  updateOrders(product) {
    const order = {
      product,
      quantity: this.count
    }
    this.orderCartService.checkCart().subscribe(data => {
      if (!data['cartEmpty']) {
        this.orderCartService.updateCart(order);
      } else {
        this.orderCartService.createCart(order);
      }
    });
    this.spinner.show();
  }


  updateFeeback() {
    if (!this.isLogin) {
      this.toast.info('Đăng nhập để bình luận');
      return;
    }
    const body = {
      content: this.feedbackForm.value.feedbacks,
      product: this.product.id
    };
    this.productService.updateFeeback(body).subscribe(data => {
      if (data) {
        this.onLoadProduct(this.product.id);
        this.feedbackForm.reset();
      }
    });
  }

  onLoadProduct(id: string) {
    this.productService.getProduct(id).subscribe(data => {
      this.product = data;
      this.feedbacks = this.product.feedback;
      this.feedbacks.map(x => {
        if (x.createdAtDate) {
          x.createdAtDate = moment(x.createdAtDate).format('DD-MM-YYYY HH:mm');
        }
      });
      this.onRelatedProduct(); // Get list of related products
      this.spinner.hide();
    });
  }

  onCountQuantity(action: string) {
    action === 'increment' ? this.count++ : this.count--;
  }

  onRelatedProduct() {
    this.productService.relatedProduct(this.product.category).subscribe(data => {
      this.relatedProduct = data;
      this.relatedProduct.splice(this.relatedProduct.findIndex(x => x.id === this.product.id), 1);
      this.slides = this.chunk(this.relatedProduct, 4); // set sliders related products
    })
  }

  // slide related products
  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  private buildForm() {
    this.feedbackForm = this.formBuilder.group({
      feedbacks: new FormControl('', [Validators.required])
    })
  }
}
