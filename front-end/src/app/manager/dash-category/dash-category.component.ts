import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { DialogDashCategoryComponent } from '../dialog-dash-category/dialog-dash-category.component';
import { ICategory } from 'src/@core/interface/ICategory.interface';
import { CategoryService } from 'src/@core/services/category/category.service';

@Component({
  selector: 'shop-dash-category',
  templateUrl: './dash-category.component.html',
  styleUrls: ['./dash-category.component.scss']
})
export class DashCategoryComponent implements OnInit {
  isLoading = true;
  categorys: ICategory[] = [];
  isToggle: Boolean = false;
  productChecked: '';
  displayedColumns: string[] = ['no', 'categoryname', 'action'];
  dataSource: MatTableDataSource<ICategory>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  selectedIdDetele = '';
  constructor(public dialog: MatDialog, private title: Title,
    private categoryService: CategoryService,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    this.onSetTitle();
    this.onFetchUsers();
  }

  onFetchUsers() {
    this.categoryService.listCategory.subscribe((data: ICategory[]) => {
      this.categorys = data;
      this.onDataTable();
    });
  }
  onCheckedUser(user) {
    if (this.categorys) {
      this.isToggle = true;
    } else {
      this.isToggle = false;
    }
  }

  openDialogEdit(category) {
    const dialogRef = this.dialog.open(DialogDashCategoryComponent, {
      width: '450px',
      data: { category, status: true }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.onFetchUsers();
    });
  }
  openDialogAddCategory() {
    const dialogRef = this.dialog.open(DialogDashCategoryComponent, {
      width: '450px',
      data: { status: false }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.onFetchUsers();
    });
  }
  onCategoryIdDetele(selectedId: string) {
    this.selectedIdDetele = selectedId;
  }

  onDeleteCategory() {
    this.categoryService.onDeleteCategory(this.selectedIdDetele).subscribe(response => {
      if (response['isDeleted']) {
        this.toastService.success(`Xóa danh mục thành công`, 'Thông báo');
        this.categorys.splice(this.categorys.findIndex(x => x.id === this.selectedIdDetele), 1);
        this.onDataTable();
      }
    }, err => {
      if (err) {
        this.toastService.error(`${err.error}`, 'Thông báo');
      }
    })

  }

  private onDataTable() {
    this.dataSource = new MatTableDataSource<ICategory>(this.categorys);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  private onSetTitle() {
    this.title.setTitle('Quản lý danh mục sản phẩm');
  }


}
