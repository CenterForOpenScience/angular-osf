import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[osfStopPropagation]',
})
export class StopPropagationDirective {
  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('keydown', ['$event'])
  keyDown(event: Event): void {
    event.stopPropagation();
  }
}
