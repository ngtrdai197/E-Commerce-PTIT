import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/@core/services/category.service';
import { ICategory, IProduct } from 'src/@core/interface';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'shop-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  categorys: ICategory[] = [];
  products: IProduct[] = [];
  firstCategoryId = '';
  constructor(
    private title: Title, 
    private categoryService: CategoryService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit() {
    this.onSetTitle();
    this.spinner.show();
    this.onLoadCategory();
  }

  filterProducts(categoryId: string) {
    this.categorys.filter(x => {
      if (x.id === categoryId) {
        this.products = x.products as IProduct[];
      }
    });
  }

  onLoadCategory() {
    this.categoryService.listCategory.subscribe(data => {
      this.categorys = data;
      this.firstCategoryId = this.categorys[0].id as string
      this.filterProducts(this.firstCategoryId);
      this.spinner.hide();
    });
  }

  onSetTitle() {
    this.title.setTitle('Trang chủ');
  }
}
