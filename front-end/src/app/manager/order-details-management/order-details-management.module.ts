import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailsManagementComponent } from './order-details-management.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/@shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [{ path: ':orderId', component: OrderDetailsManagementComponent }]

@NgModule({
  declarations: [OrderDetailsManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes)
  ]
})
export class OrderDetailsManagementModule { }
