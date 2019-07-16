import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { AnimationCpnDirective } from './directives/animation-cpn.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DescriptionPipe } from './describe.pipe';
import { RouterModule } from '@angular/router';
import { SubTitlePipe } from './title-cart.pipe';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, LayoutComponent, AnimationCpnDirective, DescriptionPipe, SubTitlePipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  exports: [HeaderComponent, FooterComponent, LayoutComponent, AnimationCpnDirective, DescriptionPipe, SubTitlePipe]
})
export class SharedModule { }
