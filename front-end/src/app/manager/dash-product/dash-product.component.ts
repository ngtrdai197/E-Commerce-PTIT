import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource, MatDialog, MatSort, MatPaginator } from '@angular/material';
import { IProduct } from 'src/@core/interface/IProduct.interface';
import { CategoryService } from 'src/@core/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/@core/services/product.service';
import { ICategory } from 'src/@core/interface';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'shop-dash-product',
  templateUrl: './dash-product.component.html',
  styleUrls: ['./dash-product.component.scss']
})
export class DashProductComponent implements OnInit {
  isLoading = true;
  categorys: IProduct[] = [];
  isToggle: Boolean = false;
  productChecked: '';
  displayedColumns: string[] = ['productName', 'title', 'description', 'currentPrice', 'oldPrice', 'discount', 'images', 'action'];
  dataSource: MatTableDataSource<IProduct>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef;

  selectedIdDetele = '';
  categoryId = '';
  currentProduct = '';
  public createForm: FormGroup;
  public editForm: FormGroup;
  viewImages = [];
  sex: Number;
  urlImage = '';
  constructor(public dialog: MatDialog, private title: Title,
    private categoryService: CategoryService,
    private toastService: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService, private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.onSetTitle();
    this.buildForm();
    this.activatedRoute.params.subscribe(params => {
      this.categoryId = params['id'];
      this.spinner.show();
      this.viewImages = [];
      this.refresh();
    });
  }

  onViewImages(images: string[], productId: string) {
    if (images.length === 0) {
      this.toastService.info('Sản phẩm chưa có hình ảnh.', 'Thông báo');
    } else {
      this.currentProduct = productId;
      this.viewImages = [...images.map(x => {
        return x = `http://localhost:3000/` + x;
      })];
    }
  }

  getUrlImageDelete(url: string) {
    this.urlImage = url ? url : '';
  }

  removeImageOfProduct() {
    const index = this.viewImages.indexOf(this.urlImage);
    if (index != -1) {
      const body = {
        productId: this.currentProduct,
        linkImage: this.viewImages[index]
      };
      this.viewImages.splice(index, 1);
      this.productService.unLinkImage(body).subscribe(response => {
        if (response.isDeleted) {
          this.toastService.success(response['message']);
          this.refresh();
        }
      });
      if (this.viewImages.length === 0) {
        this.closeModal.nativeElement.click();
      }
    }
  }

  onCreateProduct() {
    const product: IProduct = {
      productName: this.createForm.value.name,
      category: this.categoryId,
      currentPrice: this.createForm.value.currentPrice,
      oldPrice: this.createForm.value.oldPrice,
      description: this.createForm.value.description,
      title: this.createForm.value.title,
      sex: +this.createForm.value.sex
    }
    this.productService.createProduct(product).subscribe((response) => {
      if (response) {
        this.refresh();
        this.toastService.success('Thêm sản phẩm thành công', 'Thông báo');
        this.createForm.reset();
      }
    });
  }

  updateImages(event) {
    const files = event.target.files;
    console.log(files);
    
    this.editForm.get('images').setValue({
      images: files
    });
  }

  update(product: IProduct) {
    this.editForm = this.formBuilder.group({
      name: new FormControl(product.productName, Validators.required),
      currentPrice: new FormControl(product.currentPrice, Validators.required),
      oldPrice: new FormControl(product.oldPrice),
      description: new FormControl(product.description, Validators.required),
      title: new FormControl(product.title, Validators.required),
      sex: new FormControl(product.sex),
      images: new FormControl(null)
    });
    this.currentProduct = product.id as string;
  }

  getIdToDelete(product: IProduct) {
    this.selectedIdDetele = product.id as string;
  }

  delete() {
    this.productService.deleteProduct(this.selectedIdDetele).subscribe(response => {
      if (response.isDeleted) {
        this.refresh();
        this.toastService.success('Xóa sản phẩm thành công');
      } else {
        this.refresh();
        this.toastService.error(response.message);
      }
    })
  }

  onUpdateProduct() {
    const payload = new FormData();
    if (this.editForm.value.description) {
      payload.append('description', this.editForm.value.description);
    }
    if (this.editForm.value.oldPrice) {
      payload.append('oldPrice', this.editForm.value.oldPrice);
    }
    payload.append('productName', this.editForm.value.name);
    payload.append('category', this.categoryId);
    payload.append('currentPrice', this.editForm.value.currentPrice);
    payload.append('title', this.editForm.value.title);
    payload.append('sex', this.editForm.value.sex);
    payload.append('id', this.currentProduct);

    if (this.editForm.value.images) {
      for (let index = 0; index < this.editForm.value.images.images.length; index++) {
        const element = this.editForm.value.images.images[index];
        payload.append('images', element);
      }
    }
    this.productService.updateProduct(payload).subscribe((response) => {
      if (response) {
        this.refresh();
        this.toastService.success('Cập nhật sản phẩm thành công');
      }
    }, (error) => {
      this.toastService.error(error, 'Lỗi');
    });
  }

  private refresh() {
    this.categoryService.onGetById(this.categoryId).subscribe((response: ICategory) => {
      this.dataSource = new MatTableDataSource<IProduct>(response.products as IProduct[]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.spinner.hide();
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private onSetTitle() {
    this.title.setTitle('Quản lý sản phẩm');
  }

  private buildForm() {
    this.createForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      currentPrice: new FormControl('', [Validators.required]),
      oldPrice: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      sex: new FormControl(null, [Validators.required]),
      images: new FormControl(null),
    });
    this.editForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      currentPrice: new FormControl('', [Validators.required]),
      oldPrice: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      sex: new FormControl(null, [Validators.required]),
      images: new FormControl(null)
    });
  }
}

