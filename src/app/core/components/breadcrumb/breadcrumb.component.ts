import { filter, map, startWith } from 'rxjs';

import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { RouteData } from '@osf/core/models';
import { IconComponent } from '@osf/shared/components';

@Component({
  selector: 'osf-breadcrumb',
  imports: [IconComponent],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly routeData = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.getCurrentRouteData()),
      startWith(this.getCurrentRouteData())
    ),
    { initialValue: { skipBreadcrumbs: false } as RouteData }
  );

  readonly showBreadcrumb = computed(() => this.routeData()?.skipBreadcrumbs !== true);

  readonly parsedUrl = computed(() =>
    this.url()
      .split('?')[0]
      .split('/')
      .filter(Boolean)
      .map((segment) => segment.replace(/-/g, ' '))
  );

  private getCurrentRouteData(): RouteData {
    let currentRoute = this.route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    return currentRoute.snapshot.data as RouteData;
  }
}
