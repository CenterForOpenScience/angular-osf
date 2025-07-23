import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { AddToCollectionState } from '@osf/features/collections/store/add-to-collection';
import { ConfirmLeavingGuard } from '@shared/guards';
import { ContributorsState, ProjectsState } from '@shared/stores';
import { CollectionsState } from '@shared/stores/collections';

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
        canDeactivate: [ConfirmLeavingGuard],
      },
      {
        path: ':id/moderation',
        loadChildren: () =>
          import('@osf/features/moderation/collection-moderation.routes').then((m) => m.collectionModerationRoutes),
      },
    ],
  },
];
