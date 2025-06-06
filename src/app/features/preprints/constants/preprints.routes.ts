import { Routes } from '@angular/router';

import { PreprintsComponent } from '@osf/features/preprints/preprints.component';

export const preprintsRoutes: Routes = [
  {
    path: '',
    component: PreprintsComponent,
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
    ],
  },
];
