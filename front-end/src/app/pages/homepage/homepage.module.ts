import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/@shared/shared.module';
import { ProductComponent } from '../product/product.component';

const routes: Routes = [
  { path: "", component: HomepageComponent }
]


@NgModule({
  declarations: [
    HomepageComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HomepageModule { }
