import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/@core/services/product/product.service';
import { IProduct, IFeedback } from 'src/@core/interface';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

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
    private productService: ProductService,
    private orderCartService: OrderCartService, private toast: ToastrService
  ) { }


  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.onLoadProduct(params['id']);
      this.orderCartService.orderCart.subscribe(data => {
        if (data) {
          const index = +(data.products as IProduct[]).findIndex(x => x.id === params['id']);
          this.count = (data.products as IProduct[])[index] ? (data.products as IProduct[])[index].order.quantityOrder : 0;
        }
      })
    });
    this.slides = this.chunk(this.cards, 4);
  }

  updateFeeback(content: string) {
    if (!this.isLogin) {
      this.toast.info('Đăng nhập để bình luận', 'Thông báo');
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

    })
  }

  onLoadProduct(id: string) {
    this.productService.getProduct(id).subscribe(data => {
      this.product = data;
      this.feedbacks = this.product.feedback;
      this.feedbacks.map(x => {
        if (x.createdAtDate) {
          x.createdAtDate = moment(x.createdAtDate).format('MMMM Do YYYY, h:mm a');
        }
      });
      console.log(this.feedbacks);
    });
  }

  onIncrement() {
    this.count++;
    this.orderCartService.increment(this.product);
  }

  onDecrement() {
    this.count--;
    this.orderCartService.decrement(this.product);
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
