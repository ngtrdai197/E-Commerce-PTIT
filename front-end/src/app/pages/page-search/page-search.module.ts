import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSearchComponent } from './page-search.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/@shared/shared.module';

const routes: Routes = [
  { path: '', component: PageSearchComponent }
]

@NgModule({
  declarations: [PageSearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PageSearchModule { }
