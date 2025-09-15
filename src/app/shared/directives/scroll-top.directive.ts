import { filter } from 'rxjs';

import { Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';

@Directive({
  selector: '[osfScrollTopOnRouteChange]',
})
export class ScrollTopOnRouteChangeDirective {
  private el = inject(ElementRef);
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        (this.el.nativeElement as HTMLElement).scrollTo({
          top: 0,
          behavior: 'instant',
        });
      });
  }
}
