import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { RegistriesComponent } from '@osf/features/registries/registries.component';
import { RegistriesState } from '@osf/features/registries/store';

import { ModerationState } from '../moderation/store';

export const registriesRoutes: Routes = [
  {
    path: '',
    component: RegistriesComponent,
    providers: [provideStates([RegistriesState])],
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
    ],
  },
];
