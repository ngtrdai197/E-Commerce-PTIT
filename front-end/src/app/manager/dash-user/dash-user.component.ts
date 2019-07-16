import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/@core/services/user/user.service';
import { IUser } from 'src/@core/interface/IUser.interface';
import { DialogDashUserComponent } from '../dialog-dash-user/dialog-dash-user.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'shop-dash-user',
  templateUrl: './dash-user.component.html',
  styleUrls: ['./dash-user.component.scss']
})

export class DashUserComponent implements OnInit {
  users: IUser[] = [];
  isToggle: Boolean = false;
  isLoading = true;
  displayedColumns: string[] = ['no', 'username', 'fullname', 'address', 'role', 'action'];
  dataSource: MatTableDataSource<IUser>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  selectedIdDetele = '';
  constructor(public dialog: MatDialog, private title: Title,
    private userService: UserService,
    private toastService: ToastrService,
  ) { }

  ngOnInit() {
    this.onSetTitle();
    this.onFetchUsers();
  }

  onFetchUsers() {
    this.userService.onFetchUsers().subscribe((data: IUser[]) => {
      this.users = data;
      this.onDataTable();
    });
  }
  onCheckedUser(user) {
    if (this.users) {
      this.isToggle = true;
    } else {
      this.isToggle = false;
    }
  }

  openDialogEdit(user) {
    const dialogRef = this.dialog.open(DialogDashUserComponent, {
      width: '450px',
      data: { user, status: true }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.onFetchUsers();
    });
  }
  openDialogAddUser() {
    const dialogRef = this.dialog.open(DialogDashUserComponent, {
      width: '450px',
      data: { status: false }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.onFetchUsers();
    });
  }
  onUserIdDetele(selectedId: string) {
    this.selectedIdDetele = selectedId;
  }

  onDeleteAccount() {
    this.userService.onDeleteUser(this.selectedIdDetele).subscribe(response => {
      if (response) {
        this.toastService.success(`${response['message']}`, 'Thông báo');
        this.users.splice(this.users.findIndex(x => x.id === this.selectedIdDetele), 1);
        this.onDataTable();
      }
    }, err => {
      if (err) {
        this.toastService.error(`${err.error.message}`, 'Thông báo');
      }
    });

  }

  private onDataTable() {
    this.dataSource = new MatTableDataSource<IUser>(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }

  applyFilter(filterValue: string) {    
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  private onSetTitle() {
    this.title.setTitle('Quản lý người dùng');
  }

}
