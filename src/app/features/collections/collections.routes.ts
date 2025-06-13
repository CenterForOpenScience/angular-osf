import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { CollectionsComponent } from '@osf/features/collections/collections.component';

import { ModerationState } from '../moderation/store';

export const collectionsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: CollectionsComponent,
      },
      {
        path: 'moderation',
        loadComponent: () =>
          import('@osf/features/moderation/pages/collection-moderation/collection-moderation.component').then(
            (m) => m.CollectionModerationComponent
          ),
        providers: [provideStates([ModerationState])],
      },
    ],
  },
];
