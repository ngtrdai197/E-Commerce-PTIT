import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/@core/services/category.service';
import { ICategory, IProduct } from 'src/@core/interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ProductService } from 'src/@core/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'shop-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  categorys: ICategory[] = [];
  products: IProduct[] = [];
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
    perPage: 16
  };
  page: any;

  constructor(
    private title: Title,
    private categoryService: CategoryService,
    private spinner: NgxSpinnerService,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.onSetTitle();
    this.getProducts();
    this.getCategories();
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

  onSearch(keyword: string){
    this.router.navigate(['/page-search'], { queryParams: { keyword: this.slug(keyword) } });
  }

  getCategories() {
    this.categoryService.listCategory.subscribe(response => {
      this.categorys = response;
    });
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

  private slug(name: string) {
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

  onSetTitle() {
    this.title.setTitle('Trang chủ');
  }
}
