import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource, MatDialog, MatSort, MatPaginator } from '@angular/material';
import { IProduct } from 'src/@core/interface/IProduct.interface';
import { CategoryService } from 'src/@core/services/category/category.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/@core/services/product/product.service';
import { ICategory } from 'src/@core/interface';

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
  displayedColumns: string[] = ['no', 'productName', 'title', 'description', 'productTotal', 'currentPrice', 'oldPrice', 'discount', 'images', 'action'];
  dataSource: MatTableDataSource<IProduct>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  selectedIdDetele = '';
  categoryId = '';
  currentProduct = '';
  public createForm: FormGroup;
  public editForm: FormGroup;
  viewImages = [];
  @Input('actionModal') actionViewImages: ElementRef;
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef;
  constructor(public dialog: MatDialog, private title: Title,
    private categoryService: CategoryService,
    private toastService: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService, private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.onSetTitle();
    this.buildForm();
    this.activatedRoute.params.subscribe(params => {
      this.categoryId = params['id'];
      this.isLoading = true;
      this.viewImages = [];
      this.refresh();
    });
  }
  onSetTitle() {
    this.title.setTitle('Quản lý sản phẩm');
  }

  onViewImages(images: string[], productId: string) {
    this.currentProduct = productId;
    if (images.length === 0) {
      // console.log(this.actionViewImages.nativeElement);
      this.toastService.info('Sản phẩm chưa có hình ảnh.', 'Thông báo');
      return;
    }
    this.viewImages = [...images.map(x => {
      return x = `http://localhost:3000/` + x;
    })];
  }

  removeImageOfProduct(image: string) {
    const index = this.viewImages.indexOf(image);
    if (index != -1) {
      const body = {
        productId: this.currentProduct,
        linkImage: this.viewImages[index]
      };
      this.viewImages.splice(index, 1);
      this.productService.unLinkImage(body).subscribe(response => {
        if (response) {
          this.toastService.success(response['message']);
          this.refresh();
        }
      })
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
      discount: this.createForm.value.discount,
      title: this.createForm.value.title,
      productTotal: this.createForm.value.quantity,
      productAvailable: this.createForm.value.quantity
    }
    this.productService.createProduct(product).subscribe((response) => {
      if (response) {
        this.refresh();
        this.toastService.success('Thêm sản phẩm thành công', 'Thông báo');
      }
    });
  }

  updateImages(event) {
    const files = event.target.files;
    this.editForm.get('images').setValue({
      images: files
    });
  }

  update(product: IProduct) {
    this.editForm = this.formBuilder.group({
      name: [product.productName, [Validators.required]],
      currentPrice: [product.currentPrice, [Validators.required]],
      oldPrice: [product.oldPrice, [Validators.required]],
      description: [product.description, [Validators.required]],
      discount: [product.discount, [Validators.required]],
      title: [product.title, [Validators.required]],
      productTotal: [product.productTotal, [Validators.required]],
      quantity: [product.productTotal, [Validators.required]],
      images: [product.images]
    });
    this.currentProduct = product.id as string;
  }
  getIdToDelete(product: IProduct) {
    this.selectedIdDetele = product.id as string;
  }

  delete() {
    this.productService.deleteProduct(this.selectedIdDetele).subscribe(response => {
      if (response) {
        this.refresh();
        this.toastService.success('Xóa sản phẩm thành công', 'Thông báo');
      }
    })
  }

  onUpdateProduct() {
    const payload = new FormData();
    payload.append('productName', this.editForm.value.name);
    payload.append('category', this.categoryId);
    payload.append('currentPrice', this.editForm.value.currentPrice);
    payload.append('oldPrice', this.editForm.value.oldPrice);
    payload.append('description', this.editForm.value.description);
    payload.append('discount', this.editForm.value.discount);
    payload.append('title', this.editForm.value.title);
    payload.append('productTotal', this.editForm.value.productTotal);
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
        this.toastService.success('Cập nhật sản phẩm thành công', 'Thông báo');
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
      this.isLoading = false;
    });
  }

  private buildForm() {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      currentPrice: ['', [Validators.required]],
      oldPrice: ['', [Validators.required]],
      description: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      productTotal: ['', Validators.required],
      images: [null],
    });
    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      currentPrice: ['', [Validators.required]],
      oldPrice: ['', [Validators.required]],
      description: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      productTotal: ['', Validators.required],
      quantity: ['', [Validators.required]],
      images: [null]
    });
  }
}

