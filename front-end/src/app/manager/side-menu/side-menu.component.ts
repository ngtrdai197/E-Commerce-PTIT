import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/@core/services/shared/share.service';
import { CategoryService } from 'src/@core/services/category/category.service';
import { ICategory } from 'src/@core/interface/ICategory.interface';

@Component({
  selector: 'shop-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  toggleSideBar = true;
  categoryTypes: any;
  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.onCategoryTypes().subscribe(data => {
      this.categoryTypes = data;
    });
  }
  selectCategory(category: ICategory){
    
  }

}
