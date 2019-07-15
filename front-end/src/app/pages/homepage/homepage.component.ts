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
  constructor(private title: Title, private categoryService: CategoryService) { }

  ngOnInit() {
    this.onSetTitle();
    this.onLoadCategory();
  }

  filterProducts(categoryId: string) {
    this.categorys.filter(x => {
      if (x.id === categoryId) {
        this.products = x.products as IProduct[];
        this.products.map(x => {
          return x.images.map(img => {
            return img = `${API.HOST}/${img}`;
          });
        });
        console.log(this.products);
      }
    });


  }

  onLoadCategory() {
    this.categoryService.onFetchCategorys().subscribe(data => {
      this.categorys = data;
    });
  }

  onSetTitle() {
    this.title.setTitle('Trang chủ');
  }
}
