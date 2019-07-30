import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/@core/services/product.service';
import { IProduct, IFeedback } from 'src/@core/interface';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'shop-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  cards = [
    {
      title: 'Card Title 1',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 2',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 3',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 4',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 5',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 6',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 7',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 8',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 9',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
  ];
  slides: any = [[]];
  product: IProduct;
  feedbacks: IFeedback[];
  count = 0;
  isLogin = localStorage.getItem('x-access-token');
  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService, private spinner: NgxSpinnerService,
    private orderCartService: OrderCartService, private toast: ToastrService,
  ) { }


  ngOnInit() {
    this.spinner.show();
    this.activatedRoute.params.subscribe(params => {
      this.onLoadProduct(params['id']);
      this.orderCartService.orderCart.subscribe(data => {
        if (data) {
          const index = data.carts.findIndex(x => x.product.id === params['id']);
          this.count = index != -1 ? data.carts[index].quantity : 0;
        }
      });
    });
    this.slides = this.chunk(this.cards, 4);
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


  updateFeeback(content: string) {
    if (!this.isLogin) {
      this.toast.info('Đăng nhập để bình luận');
      return;
    }
    const body = {
      content,
      product: this.product.id
    };
    this.productService.updateFeeback(body).subscribe(data => {
      if (data) {
        this.onLoadProduct(this.product.id);
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
      this.spinner.hide();
    });
  }

  onCountQuantity(action: string) {
    action === 'increment' ? this.count++ : this.count--;
  }

  // slide related products
  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }
}
