import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/@core/services/category/category.service';
import { ICategory, IProduct } from 'src/@core/interface';
import { API } from 'src/@core/config/API';

@Component({
  selector: 'shop-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  categorys: ICategory[] = [];
  products: IProduct[] = [];
  firstCategoryId = '';
  constructor(private title: Title, private categoryService: CategoryService) { }

  ngOnInit() {
    this.onSetTitle();
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
    });
  }

  onSetTitle() {
    this.title.setTitle('Trang chủ');
  }
}
