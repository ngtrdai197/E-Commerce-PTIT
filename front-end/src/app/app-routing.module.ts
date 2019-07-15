import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from 'src/@core/auth/auth.guard';
import { AuthUserGuard } from 'src/@core/auth/auth-user.guard';

// AuthUserGuard dùng xác định tuyến đường cho người dùng có quyền User
// AuthGuard dùng xác định tuyến đường cho người dùng có quyền Admin

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadChildren: () => import('./pages/homepage/homepage.module').then(m => m.HomepageModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin', loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule), canActivate: [AuthGuard] },
  { path: 'product/:id', loadChildren: () => import('./pages/product-details/product-details.module').then(m => m.ProductDetailsModule) },
  // {
  //   path: 'home', component: LayoutComponent, children: [
  //     { path: '', component: HomepageComponent }
  //   ]
  // },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
