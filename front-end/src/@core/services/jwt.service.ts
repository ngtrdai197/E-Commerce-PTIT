import { Injectable } from '@angular/core';
import * as decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/@core/interface';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/@core/config/API';
import { OrderCartService } from './order-cart.service';

@Injectable({ providedIn: "root" })
export class JwtService {
  private userProfile = new BehaviorSubject<IUser>(null);

  get getProfile() {
    return this.userProfile.asObservable();
  }

  constructor(private http: HttpClient, private orderCartService: OrderCartService) { }

  setUserProfile(user: IUser) {
    this.userProfile.next(user);
  }

  getUserProfileByToken() {
    this.http.get(`${API.HOST}/api/auth/profile`).subscribe(response => {
      if (response['avatar']) {
        response['avatar'] = `${API.HOST}/${response['avatar']}`;
      }
      return this.setUserProfile(response as IUser);
    }, err => {
      throw err;
    });
  }

  setToken(token) {
    localStorage.setItem('x-access-token', token);
  }

  getToken(): string {
    return localStorage.getItem('x-access-token');
  }

  destroyWithSignOut() {
    localStorage.removeItem('x-access-token');
    this.orderCartService.removeCart();
    this.setUserProfile(null);
  }
  
  decodeToken(token) {
    const decoded = decode(token);
    return decoded;
  }

}
