import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterCeptorService implements HttpInterceptor {

  constructor(private jwtService: JwtService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('x-access-token');
    if (token) {
      req = req.clone({
        setHeaders: {
          'x-access-token': `${token}`
        }
      });
      return next.handle(req).pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
            return next.handle(req);
          }
        }, ((err: any) => {
          if (err.error.statusCode === 401) {
            // redirect to the login route
            this.router.navigate(['auth']);
            this.jwtService.destroyWithSignOut();
          }
          throw err;
        })
        )
      );
    }
    return next.handle(req);
  }
}
