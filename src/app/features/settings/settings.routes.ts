import { Routes } from '@angular/router';

import { developerAppsRoute } from '@osf/features/settings/developer-apps/developer-apps.route';
import { SettingsContainerComponent } from '@osf/features/settings/settings-container.component';
import { tokensAppsRoute } from '@osf/features/settings/tokens/tokens.route';

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
              import('./addons/connect-addon/connect-addon.component').then((mod) => mod.ConnectAddonComponent),
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
