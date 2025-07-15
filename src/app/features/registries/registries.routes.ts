import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { RegistriesComponent } from '@osf/features/registries/registries.component';
import { RegistriesState } from '@osf/features/registries/store';
import { ContributorsState, SubjectsState } from '@osf/shared/stores';

import { LicensesHandlers, ProjectsHandlers, ProvidersHandlers } from './store/handlers';
import { LicensesService } from './services';

export const registriesRoutes: Routes = [
  {
    path: '',
    component: RegistriesComponent,
    providers: [
      provideStates([RegistriesState, ContributorsState, SubjectsState]),
      ProvidersHandlers,
      ProjectsHandlers,
      LicensesHandlers,
      LicensesService,
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () => import('@osf/features/registries/pages').then((c) => c.RegistriesLandingComponent),
      },
      {
        path: 'my-registrations',
        loadComponent: () => import('@osf/features/registries/pages').then((c) => c.MyRegistrationsComponent),
      },
      {
        path: ':id/moderation',
        loadChildren: () =>
          import('@osf/features/moderation/registry-moderation.routes').then((c) => c.registryModerationRoutes),
      },
      {
        path: ':providerId/new',
        loadComponent: () =>
          import('./components/new-registration/new-registration.component').then(
            (mod) => mod.NewRegistrationComponent
          ),
      },
      {
        path: 'drafts',
        loadComponent: () => import('./components/drafts/drafts.component').then((mod) => mod.DraftsComponent),
        children: [
          {
            path: ':id/metadata',
            loadComponent: () =>
              import('./components/metadata/metadata.component').then((mod) => mod.MetadataComponent),
          },
          {
            path: ':id/review',
            loadComponent: () => import('./components/review/review.component').then((mod) => mod.ReviewComponent),
          },
          {
            path: ':id/:step',
            loadComponent: () =>
              import('./components/custom-step/custom-step.component').then((mod) => mod.CustomStepComponent),
          },
        ],
      },
    ],
  },
];
