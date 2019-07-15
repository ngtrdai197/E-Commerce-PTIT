import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from '../services/user/jwt.service';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthUserGuard implements CanActivate {

  constructor(private router: Router, private jwtService: JwtService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.jwtService.getToken()) {
      // navigate to login
      this.router.navigate(['auth']);
      return false;
    } else {
      const decode = this.jwtService.decodeToken(this.jwtService.getToken());
      // console.log(decode);

      if (decode.role === "User") {
        return true;
      }
      this.router.navigate(['']);
      return false;
    }
  }
}
