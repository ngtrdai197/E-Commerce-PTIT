import { Component, OnInit, Inject } from '@angular/core';
import { IDialogCategory } from 'src/@core/interface/IDialogUser.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/@core/services/category.service';
import { ICategory } from 'src/@core/interface/ICategory.interface';
import { ShareService } from 'src/@core/services/share.service';

@Component({
  selector: 'shop-dialog-dash-category',
  templateUrl: './dialog-dash-category.component.html',
  styleUrls: ['./dialog-dash-category.component.scss']
})
export class DialogDashCategoryComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogDashCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogCategory,
    private toastService: ToastrService,
    private categoryService: CategoryService,
    private shareService: ShareService
  ) { }

  ngOnInit() {
  }

  onUpdate() {
    if (!this.data.category.categoryName) {
      this.toastService.warning('Cập nhật tên danh mục không được để  trống. Kiểm tra lại');
      return;
    }
    this.categoryService.onUpdateCategory(this.data.category).subscribe(response => {
      if (response) {
        this.shareService.setEventEmitter(true);
        this.toastService.success(`Cập nhật danh mục thành công`);
      }
    }, err => {
      if (err) {
        this.toastService.error(`${err.error.message}`, 'Thông báo');
      }
    });
    this.dialogRef.close();
  }
  onAddNewCategory(categoryName: string) {
    if (!categoryName) {
      this.toastService.warning('Chưa nhập tên cho danh mục sản phẩm');
      return;
    }
    const category: ICategory = {
      categoryName
    }
    this.categoryService.onAddCategory(category).subscribe(response => {
      if (response) {
        this.shareService.setEventEmitter(true);
        this.toastService.success(`Thêm danh mục thành công`);
      }
    }, err => {
      if (err) {
        this.toastService.error(`${err.error.message}`, 'Thông báo');
      }
    });
    this.dialogRef.close();
  }
}
