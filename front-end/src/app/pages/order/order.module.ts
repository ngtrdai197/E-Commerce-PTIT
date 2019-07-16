import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/@shared/shared.module';

const routes: Routes = [
  { path: '', component: OrderComponent }
];

@NgModule({
  declarations: [OrderComponent],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class OrderModule { }
