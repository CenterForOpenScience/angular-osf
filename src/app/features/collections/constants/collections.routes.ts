import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { AddToCollectionComponent } from '@osf/features/collections/components/add-to-collection/add-to-collection.component';
import { CollectionsDiscoverComponent } from '@osf/features/collections/components/collections-discover/collections-discover.component';
import { ProjectsState } from '@shared/stores';

import { ModerationState } from '../../moderation/store';

export const collectionsRoutes: Routes = [
  {
    path: '',

    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('@osf/core/components/page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent),
        data: { skipBreadcrumbs: true },
      },
      {
        path: ':id',
        redirectTo: ':id/discover',
      },
      {
        path: ':id/discover',
        pathMatch: 'full',
        component: CollectionsDiscoverComponent,
      },
      {
        path: ':id/add',
        pathMatch: 'full',
        component: AddToCollectionComponent,
        providers: [provideStates([ProjectsState])],
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
