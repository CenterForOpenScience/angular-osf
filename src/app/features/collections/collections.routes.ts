import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';
import { ConfirmLeavingGuard } from '@osf/shared/guards';
import { ActivityLogsState } from '@osf/shared/stores/activity-logs';
import { BookmarksState } from '@osf/shared/stores/bookmarks';
import { CitationsState } from '@osf/shared/stores/citations';
import { CollectionsState } from '@osf/shared/stores/collections';
import { NodeLinksState } from '@osf/shared/stores/node-links';
import { ProjectsState } from '@osf/shared/stores/projects';
import { SubjectsState } from '@osf/shared/stores/subjects';

import { CollectionsModerationState } from '../moderation/store/collections-moderation';
import { ProjectOverviewState } from '../project/overview/store';
import { SettingsState } from '../project/settings/store';

import { AddToCollectionState } from './store/add-to-collection';

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
        path: ':providerId',
        redirectTo: ':providerId/discover',
      },
      {
        path: ':providerId/discover',
        pathMatch: 'full',
        loadComponent: () =>
          import('@osf/features/collections/components/collections-discover/collections-discover.component').then(
            (mod) => mod.CollectionsDiscoverComponent
          ),
        providers: [provideStates([CollectionsState])],
      },
      {
        path: ':providerId/add',
        pathMatch: 'full',
        loadComponent: () =>
          import('@osf/features/collections/components/add-to-collection/add-to-collection.component').then(
            (mod) => mod.AddToCollectionComponent
          ),
        providers: [provideStates([ProjectsState, CollectionsState, AddToCollectionState])],
        canActivate: [authGuard],
        canDeactivate: [ConfirmLeavingGuard],
      },
      {
        path: ':providerId/:id/edit',
        loadComponent: () =>
          import('@osf/features/collections/components/add-to-collection/add-to-collection.component').then(
            (mod) => mod.AddToCollectionComponent
          ),
        providers: [provideStates([ProjectsState, CollectionsState, AddToCollectionState])],
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
          provideStates([
            ProjectOverviewState,
            NodeLinksState,
            CitationsState,
            CollectionsState,
            CollectionsModerationState,
            ActivityLogsState,
            BookmarksState,
            SubjectsState,
            SettingsState,
          ]),
        ],
      },
    ],
  },
];
