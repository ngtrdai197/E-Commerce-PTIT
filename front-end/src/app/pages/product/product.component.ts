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
