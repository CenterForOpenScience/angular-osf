import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { registrationModerationGuard } from '@core/guards/registration-moderation.guard';
import { authGuard } from '@osf/core/guards';
import { RegistriesComponent } from '@osf/features/registries/registries.component';
import { RegistriesState } from '@osf/features/registries/store';
import { CitationsState, ContributorsState, SubjectsState } from '@osf/shared/stores';
import { RegistrationProviderState } from '@osf/shared/stores/registration-provider';

import { LicensesHandlers, ProjectsHandlers, ProvidersHandlers } from './store/handlers';
import { FilesHandlers } from './store/handlers/files.handlers';
import { LicensesService } from './services';

export const registriesRoutes: Routes = [
  {
    path: '',
    component: RegistriesComponent,
    providers: [
      provideStates([RegistriesState, CitationsState, ContributorsState, SubjectsState, RegistrationProviderState]),
      ProvidersHandlers,
      ProjectsHandlers,
      LicensesHandlers,
      FilesHandlers,
      LicensesService,
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'discover',
        loadComponent: () => import('@osf/features/registries/pages').then((c) => c.RegistriesLandingComponent),
      },
      {
        path: ':name',
        loadComponent: () =>
          import('@osf/features/registries/pages/registries-provider-search/registries-provider-search.component').then(
            (c) => c.RegistriesProviderSearchComponent
          ),
      },
      {
        path: ':providerId/moderation',
        canActivate: [authGuard, registrationModerationGuard],
        loadChildren: () =>
          import('@osf/features/moderation/registry-moderation.routes').then((c) => c.registryModerationRoutes),
      },
      {
        path: ':providerId/new',
        loadComponent: () =>
          import('./components/new-registration/new-registration.component').then(
            (mod) => mod.NewRegistrationComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'drafts',
        loadComponent: () => import('./components/drafts/drafts.component').then((mod) => mod.DraftsComponent),
        children: [
          {
            path: ':id/metadata',
            loadComponent: () =>
              import('./components/registries-metadata-step/registries-metadata-step.component').then(
                (mod) => mod.RegistriesMetadataStepComponent
              ),
          },
          {
            path: ':id/review',
            loadComponent: () => import('./components/review/review.component').then((mod) => mod.ReviewComponent),
          },
          {
            path: ':id/:step',
            loadComponent: () =>
              import('./pages/draft-registration-custom-step/draft-registration-custom-step.component').then(
                (mod) => mod.DraftRegistrationCustomStepComponent
              ),
          },
        ],
      },
      {
        path: 'revisions',
        loadComponent: () =>
          import('./pages/justification/justification.component').then((mod) => mod.JustificationComponent),
        children: [
          {
            path: ':id',
            redirectTo: ':id/review',
            pathMatch: 'full',
          },
          {
            path: ':id/justification',
            loadComponent: () =>
              import('./components/justification-step/justification-step.component').then(
                (mod) => mod.JustificationStepComponent
              ),
          },
          {
            path: ':id/review',
            loadComponent: () =>
              import('./components/justification-review/justification-review.component').then(
                (mod) => mod.JustificationReviewComponent
              ),
          },
          {
            path: ':id/:step',
            loadComponent: () =>
              import('./pages/revisions-custom-step/revisions-custom-step.component').then(
                (mod) => mod.RevisionsCustomStepComponent
              ),
          },
        ],
      },
    ],
  },
];
