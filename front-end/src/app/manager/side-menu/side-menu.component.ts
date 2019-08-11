import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/@core/services/share.service';
import { CategoryService } from 'src/@core/services/category.service';
import { ICategory } from 'src/@core/interface/ICategory.interface';

@Component({
  selector: 'shop-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  toggleSideBar = true;
  categoryTypes: any[] = [];
  constructor(private categoryService: CategoryService, private shareService: ShareService) { }

  ngOnInit() {
    this.onLoadingCategoryTypes();
    this.shareService.getEventEmitter().subscribe(response => {
      if(response){
        this.onLoadingCategoryTypes();
      }
    });
  }
  onLoadingCategoryTypes() {
    this.categoryService.onCategoryTypes().subscribe(data => {
      this.categoryTypes = data;
    });
  }

}
