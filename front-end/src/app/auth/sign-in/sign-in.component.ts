import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/@core/services/user.service';
import { JwtService } from 'src/@core/services/jwt.service';
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
    this.onCheckSingIn();
  }

  onSignIn(username: string, password: string) {
    const user = {
      username, password
    }
    this.userService.onSignIn(user).subscribe(data => {
      if (data) {
        this.jwtService.setToken(data.token);
        this.jwtService.getUserProfileByToken();
        this.toastService.success('Đăng nhập thành công');
        this.router.navigate(['']);
      }
    }, (err) => {
      this.toastService.error(err.error);
    })
  }

  onCheckSingIn() {
    const token = this.jwtService.getToken();
    if (token) {
      this.router.navigate(['home']);
    }
  }

  onSetTitle() {
    this.title.setTitle('Đăng nhập tài khoản');
  }
}
