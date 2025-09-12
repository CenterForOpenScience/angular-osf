import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { authGuard } from '@osf/core/guards';
import { PreprintsComponent } from '@osf/features/preprints/preprints.component';
import { PreprintState } from '@osf/features/preprints/store/preprint';
import { PreprintProvidersState } from '@osf/features/preprints/store/preprint-providers';
import { PreprintStepperState } from '@osf/features/preprints/store/preprint-stepper';
import { ConfirmLeavingGuard } from '@shared/guards';
import { CitationsState, ContributorsState, ProjectsState, SubjectsState } from '@shared/stores';

import { PreprintModerationState } from '../moderation/store/preprint-moderation';

export const preprintsRoutes: Routes = [
  {
    path: '',
    component: PreprintsComponent,
    providers: [
      provideStates([
        PreprintProvidersState,
        PreprintStepperState,
        ContributorsState,
        SubjectsState,
        PreprintState,
        CitationsState,
      ]),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'discover',
      },
      {
        path: 'discover',
        loadComponent: () =>
          import('@osf/features/preprints/pages/landing/preprints-landing.component').then(
            (c) => c.PreprintsLandingComponent
          ),
      },
      {
        path: ':providerId/discover',
        loadComponent: () =>
          import('@osf/features/preprints/pages/preprint-provider-discover/preprint-provider-discover.component').then(
            (c) => c.PreprintProviderDiscoverComponent
          ),
      },
      {
        path: 'select',
        canActivate: [authGuard],
        loadComponent: () =>
          import('@osf/features/preprints/pages/select-preprint-service/select-preprint-service.component').then(
            (c) => c.SelectPreprintServiceComponent
          ),
      },
      {
        path: ':providerId/submit',
        canActivate: [authGuard],
        loadComponent: () =>
          import('@osf/features/preprints/pages/submit-preprint-stepper/submit-preprint-stepper.component').then(
            (c) => c.SubmitPreprintStepperComponent
          ),
        canDeactivate: [ConfirmLeavingGuard],
        providers: [provideStates([ProjectsState])],
      },
      {
        path: ':providerId/edit/:preprintId',
        canActivate: [authGuard],
        loadComponent: () =>
          import('@osf/features/preprints/pages/update-preprint-stepper/update-preprint-stepper.component').then(
            (c) => c.UpdatePreprintStepperComponent
          ),
        canDeactivate: [ConfirmLeavingGuard],
        providers: [provideStates([ProjectsState])],
      },
      {
        path: ':providerId/moderation',
        canActivate: [authGuard],
        loadChildren: () =>
          import('@osf/features/moderation/preprint-moderation.routes').then((mod) => mod.preprintModerationRoutes),
      },
      {
        path: 'my-reviewing',
        canActivate: [authGuard],
        loadComponent: () =>
          import('@osf/features/moderation/pages/my-preprint-reviewing/my-preprint-reviewing.component').then(
            (m) => m.MyPreprintReviewingComponent
          ),
        providers: [provideStates([PreprintModerationState])],
      },
      {
        path: ':providerId/new-version/:preprintId',
        canActivate: [authGuard],
        loadComponent: () =>
          import('@osf/features/preprints/pages/create-new-version/create-new-version.component').then(
            (c) => c.CreateNewVersionComponent
          ),
        canDeactivate: [ConfirmLeavingGuard],
      },
      {
        path: ':providerId',
        loadComponent: () =>
          import('@osf/features/preprints/pages/preprint-provider-overview/preprint-provider-overview.component').then(
            (c) => c.PreprintProviderOverviewComponent
          ),
      },
    ],
  },
];
