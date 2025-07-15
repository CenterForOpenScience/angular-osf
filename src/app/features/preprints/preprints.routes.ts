import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { PreprintsComponent } from '@osf/features/preprints/preprints.component';
import { PreprintProvidersState } from '@osf/features/preprints/store/preprint-providers';
import { PreprintStepperState } from '@osf/features/preprints/store/preprint-stepper';
import { PreprintsDiscoverState } from '@osf/features/preprints/store/preprints-discover';
import { PreprintsResourcesFiltersState } from '@osf/features/preprints/store/preprints-resources-filters';
import { PreprintsResourcesFiltersOptionsState } from '@osf/features/preprints/store/preprints-resources-filters-options';
import { ConfirmLeavingGuard } from '@shared/guards';
import { ContributorsState, SubjectsState } from '@shared/stores';

import { PreprintModerationState } from '../moderation/store/preprint-moderation';

export const preprintsRoutes: Routes = [
  {
    path: '',
    component: PreprintsComponent,
    providers: [
      provideStates([
        PreprintProvidersState,
        PreprintsDiscoverState,
        PreprintsResourcesFiltersState,
        PreprintsResourcesFiltersOptionsState,
        PreprintStepperState,
        ContributorsState,
        SubjectsState,
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
        canDeactivate: [ConfirmLeavingGuard],
      },
      {
        path: ':providerId/edit/:preprintId',
        loadComponent: () =>
          import('@osf/features/preprints/pages/update-preprint-stepper/update-preprint-stepper.component').then(
            (c) => c.UpdatePreprintStepperComponent
          ),
        canDeactivate: [ConfirmLeavingGuard],
      },
      {
        path: ':id/moderation',
        loadChildren: () =>
          import('@osf/features/moderation/preprint-moderation.routes').then((mod) => mod.preprintModerationRoutes),
      },
      {
        path: 'my-reviewing',
        loadComponent: () =>
          import('@osf/features/moderation/pages/my-preprint-reviewing/my-preprint-reviewing.component').then(
            (m) => m.MyPreprintReviewingComponent
          ),
        providers: [provideStates([PreprintModerationState])],
      },
      {
        path: ':providerId/new-version/:preprintId',
        loadComponent: () =>
          import('@osf/features/preprints/pages/create-new-version/create-new-version.component').then(
            (c) => c.CreateNewVersionComponent
          ),
        canDeactivate: [ConfirmLeavingGuard],
      },
    ],
  },
];
