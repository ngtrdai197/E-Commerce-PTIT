import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/@core/services/category.service';
import { ICategory, IProduct } from 'src/@core/interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'shop-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  categorys: ICategory[] = [];
  subCategorys: ICategory[] = [];
  products: IProduct[] = [];
  firstCategoryId = '';
  config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: false,
    scrollbar: false,
    navigation: true,
    pagination: false
  };

  constructor(
    private title: Title,
    private categoryService: CategoryService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.onSetTitle();
    this.onLoadCategory();
  }

  filterProducts(categoryId: string, action: string) {
    this.firstCategoryId = categoryId;
    if (action === 'category') {
      this.categorys.filter(x => {
        if (x.id === categoryId) {
          this.products = x.products as IProduct[];
        }
      });
    } else {
      this.subCategorys.filter(x => {
        if (x.id === categoryId) {
          this.products = x.products as IProduct[];
        }
      });
    }
  }

  onLoadCategory() {
    this.spinner.show();
    this.categoryService.listCategory.subscribe(data => {
      // sub for feat display category list
      this.categorys = data.length >= 5 ? data.slice(0, 4) : data;
      if (this.categorys.length === 4 && data.length >= 5) {
        this.subCategorys = data.slice(4, data.length);
        console.log(this.subCategorys);
        
      }
      this.firstCategoryId = this.categorys[0].id as string
      this.filterProducts(this.firstCategoryId, 'category');
      this.spinner.hide();
    });
  }

  onSetTitle() {
    this.title.setTitle('Trang chủ');
  }
}
