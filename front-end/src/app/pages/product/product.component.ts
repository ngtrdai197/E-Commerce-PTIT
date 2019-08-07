import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from 'src/@core/interface';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { ToastrService } from 'ngx-toastr';
import { JwtService } from 'src/@core/services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'shop-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() product: IProduct;
  constructor(
    private orderCartService: OrderCartService,
    private toast: ToastrService,
    private jwtService: JwtService,
    private router: Router
  ) { }

  ngOnInit() {
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

  addToCart(product) {
    this.jwtService.getProfile.subscribe(profile => {
      if (profile) {
        // this.orderCartService.increment(product);
        this.toast.success('Thêm vào giỏ hàng thành công');
      } else {
        this.router.navigate(['/auth/sign-in']);
      }
    });
  }

}
