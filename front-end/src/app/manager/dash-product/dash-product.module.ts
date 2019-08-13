import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/@shared/shared.module';

import { MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatSidenavModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { DashProductComponent } from './dash-product.component';

const routes: Routes = [
    { path: ':id', component: DashProductComponent }
]

@NgModule({
    declarations: [DashProductComponent],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule,
        MatOptionModule,
        MatSidenavModule,
        NgxSpinnerModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ], entryComponents: []
})
export class DashProductModule { }
