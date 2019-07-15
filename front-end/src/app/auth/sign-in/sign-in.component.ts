import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/@core/services/user/user.service';
import { JwtService } from 'src/@core/services/user/jwt.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'shop-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(
    private title: Title, private userService: UserService,
    private jwtService: JwtService, private router: Router,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    this.onSetTitle();
  }

  onSignIn(username: string, password: string) {
    const user = {
      username, password
    }
    this.userService.onSignIn(user).subscribe(data => {
      if (data) {
        this.jwtService.setToken(data.token);
        this.jwtService.getUserProfileByToken();
        this.toastService.success('Đăng nhập thành công', ' Đăng nhập');
        this.router.navigate(['']);
      }
    }, (err) => {
      if (err.error.statusCode === 404) {
        this.toastService.error(err.error.message, 'Đăng nhập không thành công');
      }
    })
  }

  onSetTitle() {
    this.title.setTitle('Đăng nhập tài khoản');
  }
}
