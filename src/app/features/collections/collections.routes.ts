import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { AddToCollectionState } from '@osf/features/collections/store/add-to-collection';
import { CollectionsState } from '@osf/features/collections/store/collections';
import { ContributorsState, ProjectsState } from '@shared/stores';

import { ModeratorsState } from '../moderation/store/moderation';

export const collectionsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('@core/components/page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent),
        data: { skipBreadcrumbs: true },
      },
      {
        path: ':id',
        redirectTo: ':id/discover',
      },
      {
        path: ':id/discover',
        pathMatch: 'full',
        loadComponent: () =>
          import('@osf/features/collections/components/collections-discover/collections-discover.component').then(
            (mod) => mod.CollectionsDiscoverComponent
          ),
        providers: [provideStates([CollectionsState])],
      },
      {
        path: ':id/add',
        pathMatch: 'full',
        loadComponent: () =>
          import('@osf/features/collections/components/add-to-collection/add-to-collection.component').then(
            (mod) => mod.AddToCollectionComponent
          ),
        providers: [provideStates([ProjectsState, CollectionsState, AddToCollectionState, ContributorsState])],
      },
      {
        path: ':id/moderation',
        loadComponent: () =>
          import('@osf/features/moderation/pages/collection-moderation/collection-moderation.component').then(
            (m) => m.CollectionModerationComponent
          ),
        providers: [provideStates([ModeratorsState])],
      },
    ],
  },
];
