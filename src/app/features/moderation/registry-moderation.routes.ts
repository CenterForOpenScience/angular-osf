import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { ResourceType } from '@osf/shared/enums';

import { ModeratorsState } from './store/moderators';
import { RegistryModerationState } from './store/registry-moderation';
import { RegistryModerationTab } from './enums';

export const registryModerationRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@osf/features/moderation/pages/registries-moderation/registries-moderation.component').then(
        (m) => m.RegistriesModerationComponent
      ),
    providers: [provideStates([RegistryModerationState])],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'pending',
      },
      {
        path: 'submitted',
        loadComponent: () =>
          import('./components/registry-submissions/registry-submissions.component').then(
            (m) => m.RegistrySubmissionsComponent
          ),
        data: { tab: RegistryModerationTab.Submitted },
      },
      {
        path: 'pending',
        loadComponent: () =>
          import('./components/registry-pending-submissions/registry-pending-submissions.component').then(
            (m) => m.RegistryPendingSubmissionsComponent
          ),
        data: { tab: RegistryModerationTab.Pending },
      },
      {
        path: 'moderators',
        loadComponent: () =>
          import('./components/moderators-list/moderators-list.component').then((m) => m.ModeratorsListComponent),
        data: { resourceType: ResourceType.Registration, tab: RegistryModerationTab.Moderators },
        providers: [provideStates([ModeratorsState])],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./components/registry-settings/registry-settings.component').then((m) => m.RegistrySettingsComponent),
        data: { tab: RegistryModerationTab.Settings },
      },
    ],
  },
];
