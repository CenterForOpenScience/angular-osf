import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { AccountSettingsState } from './account-settings/store';
import { developerAppsRoute } from './developer-apps/developer-apps.route';
import { NotificationSubscriptionState } from './notifications/store';
import { tokensAppsRoute } from './tokens/tokens.route';
import { SettingsContainerComponent } from './settings-container.component';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsContainerComponent,
    providers: [provideStates([AccountSettingsState])],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile-settings/profile-settings.component').then((c) => c.ProfileSettingsComponent),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./account-settings/account-settings.component').then((c) => c.AccountSettingsComponent),
      },
      developerAppsRoute,
      {
        path: 'addons',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('@osf/features/settings/settings-addons/settings-addons.component').then(
                (mod) => mod.SettingsAddonsComponent
              ),
          },
          {
            path: 'connect-addon',
            loadComponent: () =>
              import('@osf/features/settings/settings-addons/components/connect-addon/connect-addon.component').then(
                (mod) => mod.ConnectAddonComponent
              ),
          },
        ],
      },
      tokensAppsRoute,
      {
        path: 'notifications',
        loadComponent: () =>
          import('./notifications/notifications.component').then((mod) => mod.NotificationsComponent),
        providers: [provideStates([NotificationSubscriptionState])],
      },
    ],
  },
];
