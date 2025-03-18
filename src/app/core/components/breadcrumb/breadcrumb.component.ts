import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'osf-breadcrumb',
  imports: [],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);
  protected readonly url = signal(this.#router.url);
  protected readonly parsedUrl = computed(() => {
    return this.url().split('/').filter(Boolean);
  });

  constructor() {
    this.#router.events
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.url.set(this.#router.url);
        }
      });
  }
}
