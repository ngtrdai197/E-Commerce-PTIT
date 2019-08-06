import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { HeaderManagerComponent } from './header-manager/header-manager.component';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/@shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'user', loadChildren: () => import('./dash-user/dash-user.module').then(m => m.DashUserModule), data: { animation: 'Dash-User' } },
      { path: 'product', loadChildren: () => import('./dash-product/dash-product.module').then(m => m.DashProductModule), data: { animation: 'Dash-Product' } },
      { path: 'category', loadChildren: () => import('./dash-category/dash-category.module').then(m => m.DashCategoryModule), data: { animation: 'Dash-Category' } },
      { path: 'order', loadChildren: () => import('./order-management/order-management.module').then(m => m.OrderManagementModule), data: { animation: 'Dash-Order' } },
      { path: 'order-details', loadChildren: () => import('./order-details-management/order-details-management.module').then(m => m.OrderDetailsManagementModule), data: { animation: 'Dash-Order-Details' } }
    ]
  }
]

@NgModule({
  declarations: [
    SideMenuComponent,
    HeaderManagerComponent,
    DashboardComponent,
    DashboardContentComponent,
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [

  ]
})
export class ManagerModule { }
