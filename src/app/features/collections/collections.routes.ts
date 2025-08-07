import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { authGuard } from '@osf/core/guards';
import { AddToCollectionState } from '@osf/features/collections/store/add-to-collection';
import { CollectionsModerationState } from '@osf/features/moderation/store/collections-moderation';
import { ConfirmLeavingGuard } from '@shared/guards';
import { BookmarksState, CitationsState, ContributorsState, NodeLinksState, ProjectsState } from '@shared/stores';
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
        canActivate: [authGuard],
        canDeactivate: [ConfirmLeavingGuard],
      },
      {
        path: ':providerId/moderation',
        canActivate: [authGuard],
        loadChildren: () =>
          import('@osf/features/moderation/collection-moderation.routes').then((m) => m.collectionModerationRoutes),
      },
      {
        path: ':collectionId/moderation/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import(
            '@osf/features/moderation/components/collection-submission-overview/collection-submission-overview.component'
          ).then((mod) => mod.CollectionSubmissionOverviewComponent),
        providers: [
          provideStates([NodeLinksState, CitationsState, CollectionsModerationState, CollectionsState, BookmarksState]),
        ],
      },
    ],
  },
];
