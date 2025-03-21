import { Routes } from '@angular/router';
import { SettingsContainerComponent } from '@osf/features/settings/settings-container.component';
import { developerAppsRoute } from '@osf/features/settings/developer-apps/developer-apps.route';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsContainerComponent,
    children: [
      {
        path: 'profile-settings',
        loadComponent: () =>
          import('./profile-settings/profile-settings.component').then(
            (c) => c.ProfileSettingsComponent,
          ),
      },
      {
        path: 'account-settings',
        loadComponent: () =>
          import('./account-settings/account-settings.component').then(
            (c) => c.AccountSettingsComponent,
          ),
      },
      developerAppsRoute,
      {
        path: 'addons',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./addons/addons.component').then(
                (mod) => mod.AddonsComponent,
              ),
          },
          {
            path: 'connect-addon',
            loadComponent: () =>
              import('./addons/connect-addon/connect-addon.component').then(
                (mod) => mod.ConnectAddonComponent,
              ),
          },
        ],
      },
    ],
  },
];
