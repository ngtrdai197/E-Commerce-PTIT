import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from 'src/@core/services/search.service';
import { IProduct } from 'src/@core/interface';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'shop-page-search',
  templateUrl: './page-search.component.html',
  styleUrls: ['./page-search.component.scss']
})
export class PageSearchComponent implements OnInit {

  products: IProduct[] = [];
  isLoading = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.spinner.show();
      this.searchService.search(params['keyword']).subscribe(data => {
        console.log(data);
        this.products = data;
        this.isLoading = true;
        this.spinner.hide();
      });
    });
  }

}
