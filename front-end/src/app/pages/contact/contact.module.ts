import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/@shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment.prod';

const routes: Routes = [{
  path: '', component: ContactComponent
}]

@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.MAP_KEY
    }),
    RouterModule.forChild(routes)
  ]
})
export class ContactModule { }
