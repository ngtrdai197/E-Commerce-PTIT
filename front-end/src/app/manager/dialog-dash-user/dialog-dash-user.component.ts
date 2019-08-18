import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { IDialogUser } from 'src/@core/interface/IDialogUser.interface';
import { UserService } from 'src/@core/services/user.service';
import { IUser } from 'src/@core/interface/IUser.interface';
import { IRole } from 'src/@core/interface/IRole.interface';
import { ShareService } from 'src/@core/services/share.service';

@Component({
  selector: 'shop-dialog-dash-user',
  templateUrl: './dialog-dash-user.component.html',
  styleUrls: ['./dialog-dash-user.component.scss']
})

export class DialogDashUserComponent implements OnInit {

  username: String = "";
  password: String = "";
  fullname: String = "";
  address: String = "";
  email: String = "";
  phone: String = "";
  role: String | IRole = "";

  constructor(
    public dialogRef: MatDialogRef<DialogDashUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogUser,
    private toastService: ToastrService,
    private userService: UserService, private shareService: ShareService
  ) { }


  ngOnInit() {
    this.onCheckOutValueDialog();
  }

  // important
  onCheckOutValueDialog() {
    if (this.data.user) {
      this.username = this.data.user.username;
      this.password = this.data.user.password;
      this.fullname = this.data.user.fullName;
      this.address = this.data.user.address;
      this.email = this.data.user.email,
        this.phone = this.data.user.phone,
        this.role = this.data.user.role;
    }
  }
  onUpdate() {
    const user: IUser = {
      username: this.username,
      password: this.password,
      fullName: this.fullname,
      address: this.address,
      email: this.email,
      phone: this.phone,
      role: this.role,
      id: this.data.user.id
    }
    this.userService.onUpdateUser(user as FormData).subscribe(response => {
      if (response) {
        this.toastService.success(`Cập nhật thông tin thành công`, 'Thông báo');
        this.shareService.setUpdateUser(true);
        this.dialogRef.close();
      }
    }, err => {
      this.toastService.error(err.error.message);
    });
    this.dialogRef.close();
  }
  onAddNewUser(username, password, fullName, address, email, phone) {
    const user: IUser = {
      username, password, fullName, address, role: this.role, email, phone
    }
    this.userService.onCreateNewUser(user).subscribe(response => {
      if (response) {
        this.toastService.success(`Thêm người dùng thành công`, 'Thông báo');
        this.dialogRef.close();
      }
    }, err => {
      this.toastService.error(`${err.error.message}`, 'Thông báo');
    });
  }
}

