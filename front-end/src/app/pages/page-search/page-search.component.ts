import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SearchService } from "src/@core/services/search.service";
import { IProduct } from "src/@core/interface";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "shop-page-search",
  templateUrl: "./page-search.component.html",
  styleUrls: ["./page-search.component.scss"]
})
export class PageSearchComponent implements OnInit {
  products: IProduct[] = [];
  page: any;
  isLoading = false;
  keyword = "";
  selected = "1";
  selectedSex = "0";
  currentPage = 1;
  pagination = {
    page: 1,
    perPage: 20
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.spinner.show();
      this.keyword = params["keyword"];
      this.onChangeAndFilter();
    });
  }

  onLoading(action: string) {
    if (action == "reload") {
      this.pagination.page = 1;
    }
    this.keyword = this.keyword === "show" ? "" : this.keyword;
    this.searchService
      .search(
        this.keyword,
        parseInt(this.selected),
        +this.selectedSex,
        this.pagination
      )
      .subscribe(data => {
        this.products = data.products;
        this.page = {
          current: data.current,
          pages: new Array(data.pages),
          total: data.total
        };
        this.isLoading = true;
        this.spinner.hide();
      });
  }

  navigatePage(pageNumber) {
    this.currentPage = +pageNumber + 1;
    this.spinner.show();
    this.pagination.page = +pageNumber + 1;
    this.onLoading("navigate");
  }

  nextAndPrevious(action: string) {
    this.spinner.show();
    this.pagination.page =
      action == "pre" ? --this.currentPage : ++this.currentPage;
    this.onLoading("navigate");
  }

  onChangeAndFilter() {
    this.spinner.show();
    this.onLoading("reload");
  }
}
