import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details.component';
import { Routes, RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { SharedModule } from 'src/@shared/shared.module';

const routes: Routes = [
  { path: '', component: ProductDetailsComponent }
];

@NgModule({
  declarations: [ProductDetailsComponent],
  imports: [
    CommonModule,
    MDBBootstrapModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductDetailsModule { }
