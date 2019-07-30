import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderCartService } from '../services/order-cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthOrderMeGuard implements CanActivate {
  constructor(private orderCartService: OrderCartService, private router: Router) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.orderCartService.orderCart.subscribe(data => {
      console.log(data);
      if (!data) {
        this.router.navigate(['']);
        return false;
      }
      this.router.navigate(['order']);
      return true;
    });
    return true;
  }
}
