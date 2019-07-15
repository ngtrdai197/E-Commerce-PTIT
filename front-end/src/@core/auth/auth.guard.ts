import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanActivate, Router } from '@angular/router'
import { JwtService } from '../services/user/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private jwtService: JwtService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.jwtService.getToken()) {
      // navigate to login
      this.router.navigate(['auth']);
      return false;
    } else {
      const decode = this.jwtService.decodeToken(this.jwtService.getToken());
      if (decode.role === "Admin") {
        return true;
      }
      this.router.navigate(['']);
      return false;
    }
  }
}
