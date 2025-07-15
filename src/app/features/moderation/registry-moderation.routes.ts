import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { ResourceType } from '@osf/shared/enums';

import { ModeratorsState } from './store/moderation';
import { RegistryModerationTab } from './enums';

export const registryModerationRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@osf/features/moderation/pages/registries-moderation/registries-moderation.component').then(
        (m) => m.RegistriesModerationComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'submitted',
      },
      {
        path: 'submitted',
        loadComponent: () =>
          import('./components/registry-submissions/registry-submissions.component').then(
            (m) => m.RegistrySubmissionsComponent
          ),
        data: { tab: RegistryModerationTab.Submitted, skipBreadcrumbs: true },
      },
      {
        path: 'pending',
        loadComponent: () =>
          import('./components/collection-moderation-submissions/collection-moderation-submissions.component').then(
            (m) => m.CollectionModerationSubmissionsComponent
          ),
        data: { tab: RegistryModerationTab.Pending, skipBreadcrumbs: true },
      },
      {
        path: 'moderators',
        loadComponent: () =>
          import('./components/moderators-list/moderators-list.component').then((m) => m.ModeratorsListComponent),
        data: { resourceType: ResourceType.Registration, tab: RegistryModerationTab.Moderators, skipBreadcrumbs: true },
        providers: [provideStates([ModeratorsState])],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./components/registry-settings/registry-settings.component').then((m) => m.RegistrySettingsComponent),
        data: { tab: RegistryModerationTab.Settings, skipBreadcrumbs: true },
      },
    ],
  },
];
