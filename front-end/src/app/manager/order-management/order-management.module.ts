import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OrderManagementComponent } from './order-management.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/@shared/shared.module';
import { MatInputModule, MatNativeDateModule, MatButtonModule, MatDatepickerModule } from '@angular/material';

const routes: Routes = [
    { path: ':state', component: OrderManagementComponent }
]

@NgModule({
    declarations: [OrderManagementComponent],
    imports: [
        CommonModule,
        NgxSpinnerModule,
        MDBBootstrapModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatInputModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    providers: []
})
export class OrderManagementModule { }
