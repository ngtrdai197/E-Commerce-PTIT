import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/@core/services/product.service';
import { IProduct, IFeedback, IUser } from 'src/@core/interface';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { ToastrService } from 'ngx-toastr';
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
    private formBuilder: FormBuilder, private jwtService: JwtService,
    private router: Router
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
    if (!this.isLogin) {
      this.toast.info('Đăng nhập để có thể mua hàng');
      this.router.navigate(['/auth/sign-in']);
      return;
    }
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

  slug(name: string) {
    if(!name) return;
    name = name.toLowerCase();
    name = name.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    name = name.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    name = name.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    name = name.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    name = name.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    name = name.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    name = name.replace(/(đ)/g, 'd');
    name = name.replace(/([^0-9a-z-\s])/g, '');
    name = name.replace(/(\s+)/g, '-');
    name = name.replace(/^-+/g, '');
    name = name.replace(/-+$/g, '');
    return name;
  }

  private buildForm() {
    this.feedbackForm = this.formBuilder.group({
      feedbacks: new FormControl('', [Validators.required])
    })
  }
}
