import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailsManagementComponent } from './order-details-management.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: OrderDetailsManagementComponent }]

@NgModule({
  declarations: [OrderDetailsManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OrderDetailsManagementModule { }
