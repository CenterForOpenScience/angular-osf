import { select } from '@ngxs/store';

import { filter, map, startWith } from 'rxjs';

import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

import { ProviderSelectors } from '@core/store/provider';
import { RouteData } from '@osf/core/models';
import { InstitutionsAdminSelectors } from '@osf/features/admin-institutions/store';
import { IconComponent } from '@osf/shared/components';
import { InstitutionsSearchSelectors } from '@shared/stores/institutions-search';

@Component({
  selector: 'osf-breadcrumb',
  imports: [IconComponent],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  currentProvider = select(ProviderSelectors.getCurrentProvider);
  institution = select(InstitutionsSearchSelectors.getInstitution);
  institutionDashboard = select(InstitutionsAdminSelectors.getInstitution);

  readonly routeData = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.getCurrentRouteData()),
      startWith(this.getCurrentRouteData())
    ),
    { initialValue: { skipBreadcrumbs: false } as RouteData }
  );

  readonly showBreadcrumb = computed(() => this.routeData()?.skipBreadcrumbs !== true);

  readonly breadcrumbs = computed<string[]>(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentRoute = this.routeData(); // Trigger recomputation when route data changes
    const providerName = this.currentProvider()?.name;
    const institution = this.institution()?.name;
    const institutionDashboard = this.institutionDashboard()?.name;

    return this.buildBreadcrumbs(this.route.root.snapshot, providerName, institution ?? institutionDashboard);
  });

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    providerName: string | undefined,
    institutionName: string | undefined,
    segments: string[] = []
  ): string[] {
    for (const segment of route.url) {
      const segmentPath = segment.path;
      let label = segmentPath.replace(/-/g, ' ');

      const isProviderIdSegment = route.params['providerId'] === segmentPath;
      const isInstitutionIdSegment = route.params['institutionId'] === segmentPath;

      if (isProviderIdSegment && providerName) {
        label = providerName;
      }

      if (isInstitutionIdSegment && institutionName) {
        label = institutionName;
      }

      if (label && label.trim().length > 0) {
        segments.push(label);
      }
    }

    if (route.firstChild) {
      return this.buildBreadcrumbs(route.firstChild, providerName, institutionName, segments);
    }

    return segments;
  }

  private getCurrentRouteData(): RouteData {
    let currentRoute = this.route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    return currentRoute.snapshot.data as RouteData;
  }
}
