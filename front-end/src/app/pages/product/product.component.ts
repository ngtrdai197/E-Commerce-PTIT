import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from 'src/@core/interface';

@Component({
  selector: 'shop-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() product: IProduct;
  constructor() { }

  ngOnInit() {
    
  }

}
