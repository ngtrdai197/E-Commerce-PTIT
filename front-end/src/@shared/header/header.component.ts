import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/@core/services/jwt.service';
import { IUser, IProduct } from 'src/@core/interface';
import { API } from 'src/@core/config/API';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/@core/services/user.service';
import { OrderCartService } from 'src/@core/services/order-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shop-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  currentUser: IUser;
  role = API.ROLES;
  editForm: FormGroup;
  avatarDefault = 'assets/auth/user-default.png';
  isChangeAvatar = false;
  order: any = {};
  subscription: Subscription;
  totalOrders = 0;
  constructor(
    private router: Router, private toastService: ToastrService,
    private jwtService: JwtService, private userService: UserService,
    private toast: ToastrService, private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef, private orderCartService: OrderCartService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.subscription = this.jwtService.getProfile.subscribe(data => this.currentUser = data);
    if (this.jwtService.getToken()) {
      this.orderCartService.getOrdersCart();
      this.onGetOrders();
    }
  }

  onGetOrders() {
    this.orderCartService.orderCart.subscribe((data: any) => {
      this.totalOrders = 0;
      if (data) {
        this.order = data;
        this.order.carts.map(x => {
          this.totalOrders += x.quantity;
        });
      } else {
        this.order = {};
      }
    });
  }

  onSearch(keyword: string) {
    this.router.navigate(['/page-search'], { queryParams: { keyword: this.slug(keyword) } });
  }

  removeItem(product: IProduct) {
    this.orderCartService.removeItem(product);
    this.onGetOrders();
  }

  slug(name: string) {
    name = name.toLowerCase();
    name = name.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    name = name.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    name = name.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    name = name.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    name = name.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    name = name.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    name = name.replace(/(đ)/g, 'd');
    name = name.replace(/([^0-9a-z-\s])/g, '');
    name = name.replace(/(\s+)/g, '-');
    name = name.replace(/^-+/g, '');
    name = name.replace(/-+$/g, '');
    return name;
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
  updateUserProfile() {
    const formData = new FormData();

    formData.append('address', this.editForm.value.address as string);
    formData.append('email', this.editForm.value.email as string);
    formData.append('fullName', this.editForm.value.fullName as string);
    formData.append('phone', this.editForm.value.phone as string);
    formData.append('id', this.currentUser.id as string);
    formData.append('username', this.editForm.value.username as string);
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
  uploadProfile() {
    if (!this.currentUser.avatar) {
      this.currentUser.avatar = this.avatarDefault;
    }
    this.editForm = this.formBuilder.group({
      username: new FormControl(this.currentUser.username, Validators.required),
      fullName: new FormControl(this.currentUser.fullName, Validators.required),
      email: new FormControl(this.currentUser.email, Validators.compose([
        Validators.required,
        Validators.email
      ])),
      address: new FormControl(this.currentUser.address, Validators.required),
      phone: new FormControl(this.currentUser.phone, Validators.required),
      avatar: new FormControl(this.currentUser.avatar)
    });
  }

  myAccount() {
    this.router.navigate(['/auth']);
  }

  onNavigateAdmin() {
    this.router.navigate(['/admin/dashboard']);
  }

  onSignOut() {
    this.jwtService.destroyWithSignOut();
    this.jwtService.setUserProfile(null);
    this.toast.success('Đăng xuất thành công', 'Thông báo');
    this.router.navigate(['/']);
  }

  private buildForm() {
    this.editForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      fullName: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      avatar: new FormControl(null)
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
