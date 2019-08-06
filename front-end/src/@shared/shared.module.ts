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
import { ParserOrderPipe } from './order-name.pipe';
import { ProductComponent } from 'src/app/pages/product/product.component';

@NgModule({
  declarations: [
    FooterComponent, HeaderComponent, LayoutComponent,
    AnimationCpnDirective, DescriptionPipe, SubTitlePipe,
    ParserOrderPipe, ProductComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  exports: [HeaderComponent, ProductComponent, FooterComponent, LayoutComponent, AnimationCpnDirective, DescriptionPipe, SubTitlePipe, ParserOrderPipe]
})
export class SharedModule { }
