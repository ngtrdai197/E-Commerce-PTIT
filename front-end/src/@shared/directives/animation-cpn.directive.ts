import { Directive, Renderer2, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appAnimationCpn]'
})
export class AnimationCpnDirective implements OnInit {

  constructor(private renderer: Renderer2, private el: ElementRef) { }
  ngOnInit(){
    this.renderer.addClass(this.el.nativeElement, 'animation-component');
  }

}
