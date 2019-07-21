import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/@core/services/jwt.service';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';

@Component({
  selector: 'shop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'front-end';
  constructor(private jwtService: JwtService, private router: Router) { }
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    if (localStorage.getItem('x-access-token')) {
      this.jwtService.getUserProfileByToken();
    }
  }

}
