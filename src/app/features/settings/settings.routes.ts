import { Routes } from '@angular/router';

import { developerAppsRoute } from './developer-apps/developer-apps.route';
import { tokensAppsRoute } from './tokens/tokens.route';
import { SettingsContainerComponent } from './settings-container.component';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsContainerComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile-settings',
      },
      {
        path: 'profile-settings',
        loadComponent: () =>
          import('./profile-settings/profile-settings.component').then((c) => c.ProfileSettingsComponent),
      },
      {
        path: 'account-settings',
        loadComponent: () =>
          import('./account-settings/account-settings.component').then((c) => c.AccountSettingsComponent),
      },
      developerAppsRoute,
      {
        path: 'addons',
        children: [
          {
            path: '',
            loadComponent: () => import('./addons/addons.component').then((mod) => mod.AddonsComponent),
          },
          {
            path: 'connect-addon',
            loadComponent: () =>
              import('@osf/features/settings/addons/components/connect-addon/connect-addon.component').then(
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
      },
    ],
  },
];
