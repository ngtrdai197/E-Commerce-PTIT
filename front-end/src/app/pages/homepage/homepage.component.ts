import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/@core/services/category.service';
import { ICategory, IProduct } from 'src/@core/interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ProductService } from 'src/@core/services/product.service';

@Component({
  selector: 'shop-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  categorys: ICategory[] = [];
  subCategorys: ICategory[] = [];
  productsMale: IProduct[] = [];
  productsFemale: IProduct[] = [];
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
  currentPage = 1;
  pagination = {
    page: 1,
    perPage: 15
  };
  page: any;

  constructor(
    private title: Title,
    private categoryService: CategoryService,
    private spinner: NgxSpinnerService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.onSetTitle();
    this.getProducts();
  }

  getProducts() {
    this.productService.getAll(this.pagination).subscribe(response => {
      this.products = response.products;
      this.page = {
        current: response.current,
        pages: new Array(response.pages),
        total: response.total
      };
      this.spinner.hide();
    })
  }

  navigatePage(pageNumber) {
    this.currentPage = +pageNumber + 1;
    this.spinner.show();
    this.pagination.page = +pageNumber + 1;
    this.getProducts();
  }

  nextAndPrevious(action: string) {
    this.spinner.show();
    this.pagination.page = action == 'pre' ? --this.currentPage : ++this.currentPage;
    this.getProducts();
  }

  onSetTitle() {
    this.title.setTitle('Trang chủ');
  }
}
