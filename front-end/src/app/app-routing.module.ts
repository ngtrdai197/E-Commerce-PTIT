import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from 'src/@core/auth/auth.guard';
import { AuthOrderMeGuard } from 'src/@core/auth/auth-order-me.guard';

// AuthUserGuard dùng xác định tuyến đường cho người dùng có quyền User
// AuthGuard dùng xác định tuyến đường cho người dùng có quyền Admin

const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./pages/homepage/homepage.module').then(m => m.HomepageModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin', loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule), canActivate: [AuthGuard] },
  { path: 'product/:name/:id', loadChildren: () => import('./pages/product-details/product-details.module').then(m => m.ProductDetailsModule) },
  { path: 'order', loadChildren: () => import('./pages/order/order.module').then(m => m.OrderModule) },
  { path: 'page-search', loadChildren: () => import('./pages/page-search/page-search.module').then(m => m.PageSearchModule) },
  { path: 'my-order', loadChildren: () => import('./pages/order-me/order-me.module').then(m => m.OrderMeModule) },
  { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule) },
  { path: 'about-me', loadChildren: () => import('./pages/about-me/about-me.module').then(m => m.AboutMeModule) },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
