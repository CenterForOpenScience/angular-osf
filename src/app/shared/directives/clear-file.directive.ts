import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[osfClearFile]',
})
export class ClearFileDirective {
  private readonly el = inject(ElementRef<HTMLInputElement>);

  @HostListener('click')
  onClick() {
    this.el.nativeElement.value = '';
  }
}
