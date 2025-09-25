import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[osfClearFile]',
})
export class ClearFileDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('click')
  onClick() {
    this.el.nativeElement.value = '';
  }
}
