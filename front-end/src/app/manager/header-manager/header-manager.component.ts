import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { JwtService } from 'src/@core/services/jwt.service';
import { Router } from '@angular/router';
import { IUser } from 'src/@core/interface';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/@core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'shop-header-manager',
  templateUrl: './header-manager.component.html',
  styleUrls: ['./header-manager.component.scss']
})
export class HeaderManagerComponent implements OnInit {

  user: IUser;
  public editForm: FormGroup;
  avatarDefault = 'assets/auth/user-default.png';
  isChangeAvatar = false;
  constructor(private jwtService: JwtService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastService: ToastrService, private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getProfile();
    this.buildForm();
  }

  onSignOut() {
    this.jwtService.destroyWithSignOut();
    this.router.navigate(['']);
  }

  onUpdateProfile() {
    const user: IUser = {
      address: this.editForm.value.address,
      email: this.editForm.value.email,
      fullName: this.editForm.value.fullName,
      phone: this.editForm.value.phone,
      username: this.editForm.value.username,
      id: this.user.id
    };
    const formData = new FormData();
    formData.append('address', user.address as string);
    formData.append('email', user.email as string);
    formData.append('fullName', user.fullName as string);
    formData.append('phone', user.phone as string);
    formData.append('id', user.id as string);
    formData.append('username', user.username as string);
    if (this.isChangeAvatar) {
      if (this.editForm.value.avatar) {
        formData.append('avatar', this.editForm.value.avatar);
      }
    }

    this.userService.onUpdateUser(formData).subscribe(response => {
      if (response) {
        this.jwtService.getUserProfileByToken();
        this.toastService.success('Cập nhật thành công', 'Thông báo');
        this.isChangeAvatar = false;
      }
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.isChangeAvatar = true;
      let reader = new FileReader();
      const avatar = event.target.files[0];
      reader.readAsDataURL(avatar);

      reader.onload = () => {
        this.avatarDefault = reader.result as string;
        this.editForm.get('avatar').setValue(avatar);
        const output = <HTMLImageElement>document.getElementById('preview');
        output.src = reader.result as string;
      };
      this.cd.markForCheck();
    }
  }

  pushProfile() {
    if (!this.user.avatar) {
      this.user.avatar = this.avatarDefault;
    }
    this.editForm = this.formBuilder.group({
      username: new FormControl(this.user.username, Validators.required),
      fullName: new FormControl(this.user.fullName, Validators.required),
      email: new FormControl(this.user.email, Validators.required),
      address: new FormControl(this.user.address, Validators.required),
      phone: new FormControl(this.user.phone, Validators.required),
      avatar: new FormControl(this.user.avatar)
    });
  }

  private getProfile() {
    this.jwtService.getProfile.subscribe(user => {
      this.user = user;
    });
  }

  private buildForm() {
    this.editForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      avatar: new FormControl(null)
    });
  }
}
