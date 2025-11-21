import { Directive, HostListener, input } from '@angular/core';

@Directive({
  selector: '[osfHorizontalScrollKeyboard]',
})
export class HorizontalScrollKeyboardDirective {
  scrollAmount = input<number>(50);

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const container = event.currentTarget as HTMLElement;
    if (!container) {
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        container.scrollBy({ left: this.scrollAmount(), behavior: 'smooth' });
        break;
      case 'ArrowLeft':
        event.preventDefault();
        container.scrollBy({ left: -this.scrollAmount(), behavior: 'smooth' });
        break;
      case 'Home':
        event.preventDefault();
        container.scrollTo({ left: 0, behavior: 'smooth' });
        break;
      case 'End':
        event.preventDefault();
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
        break;
    }
  }
}
