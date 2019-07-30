import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IUser } from 'src/@core/interface/IUser.interface';
import { UserService } from 'src/@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'shop-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  registerForm: FormGroup;
  constructor(private title: Title, private userService: UserService,
    private toastService: ToastrService, private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.onSetTitle();
    this.buildForm();
  }

  onSignUp() {
    const newUser = this.registerForm.value;
    this.userService.onCreateNewUser(newUser as IUser).subscribe(response => {
      if (response) {
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

  private buildForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      fullName: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]]
    });
  }

}
