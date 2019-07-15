import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IUser } from 'src/@core/interface/IUser.interface';
import { UserService } from 'src/@core/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'shop-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private title: Title, private userService: UserService, private toastService: ToastrService, private router: Router) { }

  ngOnInit() {
    this.onSetTitle();
  }

  onSignUp(username, fullName, address, password, email, phone) {
    const newUser: IUser = {
      username, password, fullName, address, email, phone
    };
    this.userService.onCreateNewUser(newUser).subscribe(response => {
      if (response) {
        console.log(response);
        this.toastService.success(`${response['message']}`, 'Thông báo');
        this.router.navigate(['auth/sign-in']);
      } 
    }, err => {
      if (err) {
        this.toastService.error(`${err.error.message}`, 'Thông báo');
      }
    })
  }

  private onSetTitle() {
    this.title.setTitle('Đăng ký tài khoản');
  }

}
