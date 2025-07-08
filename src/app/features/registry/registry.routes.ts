import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { ResourceType } from '@osf/shared/enums';
import { ContributorsState, ViewOnlyLinkState } from '@osf/shared/stores';

import { AnalyticsState } from '../project/analytics/store';

import { RegistryOverviewState } from './store/registry-overview';
import { RegistryComponent } from './registry.component';

export const registryRoutes: Routes = [
  {
    path: '',
    component: RegistryComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/registry-overview/registry-overview.component').then((c) => c.RegistryOverviewComponent),
        providers: [provideStates([RegistryOverviewState])],
      },
      {
        path: 'contributors',
        loadComponent: () =>
          import('../project/contributors/contributors.component').then((mod) => mod.ContributorsComponent),
        data: { resourceType: ResourceType.Registration },
        providers: [provideStates([ContributorsState, ViewOnlyLinkState])],
      },
      {
        path: 'analytics',
        loadComponent: () => import('../project/analytics/analytics.component').then((mod) => mod.AnalyticsComponent),
        data: { resourceType: ResourceType.Registration },
        providers: [provideStates([AnalyticsState])],
      },
    ],
  },
];
