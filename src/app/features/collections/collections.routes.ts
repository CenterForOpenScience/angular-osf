import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { ModerationState } from '../moderation/store';

export const collectionsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('@core/components/page-not-found/page-not-found.component').then((mod) => mod.PageNotFoundComponent),
        data: { skipBreadcrumbs: true },
      },
      {
        path: ':id',
        pathMatch: 'full',
        loadComponent: () =>
          import('@osf/features/collections/collections.component').then((mod) => mod.CollectionsComponent),
      },
      {
        path: ':id/moderation',
        loadComponent: () =>
          import('@osf/features/moderation/pages/collection-moderation/collection-moderation.component').then(
            (m) => m.CollectionModerationComponent
          ),
        providers: [provideStates([ModerationState])],
      },
    ],
  },
];
