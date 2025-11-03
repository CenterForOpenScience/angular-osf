import { filter } from 'rxjs';

import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';

@Directive({
  selector: '[osfScrollTopOnRouteChange]',
})
export class ScrollTopOnRouteChangeDirective {
  private el = inject(ElementRef);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        let route = this.router.routerState.root;

        while (route.firstChild) {
          route = route.firstChild;
        }

        if (route.snapshot.data['scrollToTop'] !== false) {
          (this.el.nativeElement as HTMLElement).scrollTo({
            top: 0,
            behavior: 'instant',
          });
        }
      });
  }
}
