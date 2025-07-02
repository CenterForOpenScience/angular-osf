import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { RegistriesComponent } from '@osf/features/registries/registries.component';
import { RegistriesState } from '@osf/features/registries/store';
import { ContributorsState } from '@osf/shared/components/contributors/store';
import { SubjectsState } from '@osf/shared/stores';
import { SUBJECTS_SERVICE } from '@osf/shared/tokens/subjects.token';

import { ModerationState } from '../moderation/store';

import { RegistrationSubjectsService } from './services';

export const registriesRoutes: Routes = [
  {
    path: '',
    component: RegistriesComponent,
    providers: [
      provideStates([RegistriesState, ContributorsState, SubjectsState]),
      {
        provide: SUBJECTS_SERVICE,
        useClass: RegistrationSubjectsService,
      },
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
        path: 'moderation',
        loadComponent: () =>
          import('@osf/features/moderation/pages/registries-moderation/registries-moderation.component').then(
            (m) => m.RegistriesModerationComponent
          ),
        providers: [provideStates([ModerationState])],
      },
      {
        path: 'new',
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
