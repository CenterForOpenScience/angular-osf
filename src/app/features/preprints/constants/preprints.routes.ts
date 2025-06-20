import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { PreprintsComponent } from '@osf/features/preprints/preprints.component';
import { PreprintsState } from '@osf/features/preprints/store/preprints';
import { PreprintsDiscoverState } from '@osf/features/preprints/store/preprints-discover';
import { PreprintsResourcesFiltersState } from '@osf/features/preprints/store/preprints-resources-filters';
import { PreprintsResourcesFiltersOptionsState } from '@osf/features/preprints/store/preprints-resources-filters-options';
import { SubmitPreprintState } from '@osf/features/preprints/store/submit-preprint';

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
        SubmitPreprintState,
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
      {
        path: 'select',
        loadComponent: () =>
          import('@osf/features/preprints/pages/select-preprint-service/select-preprint-service.component').then(
            (c) => c.SelectPreprintServiceComponent
          ),
      },
      {
        path: ':providerId/submit',
        loadComponent: () =>
          import('@osf/features/preprints/pages/submit-preprint-stepper/submit-preprint-stepper.component').then(
            (c) => c.SubmitPreprintStepperComponent
          ),
      },
    ],
  },
];
