import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { CollectionsModerationState } from '@osf/features/moderation/store/collections-moderation';
import { ResourceType } from '@osf/shared/enums';
import { CollectionsState } from '@shared/stores/collections';

import { ModeratorsState } from './store/moderators';
import { CollectionModerationTab } from './enums';

export const collectionModerationRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@osf/features/moderation/pages/collection-moderation/collection-moderation.component').then(
        (m) => m.CollectionModerationComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all-items',
      },
      {
        path: 'all-items',
        loadComponent: () =>
          import('./components/collection-moderation-submissions/collection-moderation-submissions.component').then(
            (m) => m.CollectionModerationSubmissionsComponent
          ),
        data: { tab: CollectionModerationTab.AllItems },
        providers: [provideStates([CollectionsModerationState, CollectionsState])],
      },
      {
        path: 'moderators',
        loadComponent: () =>
          import('./components/moderators-list/moderators-list.component').then((m) => m.ModeratorsListComponent),
        data: { resourceType: ResourceType.Collection, tab: CollectionModerationTab.Moderators },
        providers: [provideStates([ModeratorsState])],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./components/notification-settings/notification-settings.component').then(
            (m) => m.NotificationSettingsComponent
          ),
        data: { tab: CollectionModerationTab.Settings },
      },
    ],
  },
];
