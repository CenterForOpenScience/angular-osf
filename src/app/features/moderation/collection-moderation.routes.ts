import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { ResourceType } from '@osf/shared/enums';

import { ModeratorsState } from './store/moderation';
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
