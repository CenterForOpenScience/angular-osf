import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { PreprintsComponent } from '@osf/features/preprints/preprints.component';
import { PreprintsState } from '@osf/features/preprints/store/preprints';
import { PreprintsDiscoverState } from '@osf/features/preprints/store/preprints-discover';
import { PreprintsResourcesFiltersState } from '@osf/features/preprints/store/preprints-resources-filters';
import { PreprintsResourcesFiltersOptionsState } from '@osf/features/preprints/store/preprints-resources-filters-options';

export const preprintsRoutes: Routes = [
  {
    path: '',
    component: PreprintsComponent,
    providers: [
      provideStates([
        PreprintsState,
        PreprintsDiscoverState,
        PreprintsResourcesFiltersState,
        PreprintsResourcesFiltersOptionsState,
      ]),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('@osf/features/preprints/pages/landing/preprints-landing.component').then(
            (c) => c.PreprintsLandingComponent
          ),
      },
      {
        path: 'overview/:providerId',
        loadComponent: () =>
          import('@osf/features/preprints/pages/preprint-provider-overview/preprint-provider-overview.component').then(
            (c) => c.PreprintProviderOverviewComponent
          ),
      },
      {
        path: 'overview/:providerId/discover',
        loadComponent: () =>
          import('@osf/features/preprints/pages/preprint-provider-discover/preprint-provider-discover.component').then(
            (c) => c.PreprintProviderDiscoverComponent
          ),
      },
    ],
  },
];
