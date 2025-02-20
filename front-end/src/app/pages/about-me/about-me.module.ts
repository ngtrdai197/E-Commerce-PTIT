import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutMeComponent } from './about-me.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/@shared/shared.module';

const routes: Routes = [{ path: '', component: AboutMeComponent }];

@NgModule({
  declarations: [AboutMeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AboutMeModule { }
