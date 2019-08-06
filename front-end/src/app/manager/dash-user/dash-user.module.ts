import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/@shared/shared.module';
import { DashUserComponent } from './dash-user.component';
import { MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatSidenavModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogDashUserComponent } from '../dialog-dash-user/dialog-dash-user.component';

const routes: Routes = [{ path: '', component: DashUserComponent }]

@NgModule({
    declarations: [DashUserComponent, DialogDashUserComponent],
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
    ],
    entryComponents:[
        DialogDashUserComponent
    ]
})
export class DashUserModule { }
