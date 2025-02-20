import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderMeComponent } from './order-me.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/@shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  { path: '', component: OrderMeComponent }
]

@NgModule({
  declarations: [OrderMeComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    SharedModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes)
  ]
})
export class OrderMeModule { }