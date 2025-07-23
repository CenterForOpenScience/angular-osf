import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { ResourceType } from '@osf/shared/enums';

import { ModeratorsState } from './store/moderators';
import { PreprintModerationState } from './store/preprint-moderation';
import { PreprintModerationTab } from './enums';

export const preprintModerationRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@osf/features/moderation/pages/preprint-moderation/preprint-moderation.component').then(
        (m) => m.PreprintModerationComponent
      ),
    providers: [provideStates([PreprintModerationState])],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'submissions',
      },
      {
        path: 'submissions',
        loadComponent: () =>
          import('./components/registry-submissions/registry-submissions.component').then(
            (m) => m.RegistrySubmissionsComponent
          ),
        data: { tab: PreprintModerationTab.Submissions },
      },
      {
        path: 'withdrawals',
        loadComponent: () =>
          import('./components/collection-moderation-submissions/collection-moderation-submissions.component').then(
            (m) => m.CollectionModerationSubmissionsComponent
          ),
        data: { tab: PreprintModerationTab.WithdrawalRequests },
      },
      {
        path: 'moderators',
        loadComponent: () =>
          import('./components/moderators-list/moderators-list.component').then((m) => m.ModeratorsListComponent),
        data: { resourceType: ResourceType.Preprint, tab: PreprintModerationTab.Moderators },
        providers: [provideStates([ModeratorsState])],
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./components/notification-settings/notification-settings.component').then(
            (m) => m.NotificationSettingsComponent
          ),
        data: { tab: PreprintModerationTab.Notifications },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./components/preprint-moderation-settings/preprint-moderation-settings.component').then(
            (m) => m.PreprintModerationSettingsComponent
          ),
        data: { tab: PreprintModerationTab.Settings },
      },
    ],
  },
];
