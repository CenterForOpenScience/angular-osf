import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { RegistryFilesState } from '@osf/features/registry/store/registry-files';
import { RegistryMetadataState } from '@osf/features/registry/store/registry-metadata';
import { RegistryOverviewState } from '@osf/features/registry/store/registry-overview';
import { ResourceType } from '@osf/shared/enums';
import { ContributorsState, ViewOnlyLinkState } from '@osf/shared/stores';

import { AnalyticsState } from '../project/analytics/store';

import { RegistryResourcesState } from './store/registry-resources/registry-resources.state';
import { RegistryComponent } from './registry.component';

export const registryRoutes: Routes = [
  {
    path: '',
    component: RegistryComponent,
    providers: [provideStates([RegistryOverviewState])],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/registry-overview/registry-overview.component').then((c) => c.RegistryOverviewComponent),
      },
      {
        path: 'metadata',
        loadComponent: () =>
          import('./pages/registry-metadata/registry-metadata.component').then((c) => c.RegistryMetadataComponent),
        providers: [provideStates([RegistryMetadataState])],
      },
      {
        path: 'metadata/add',
        loadComponent: () =>
          import('./pages/registry-metadata-add/registry-metadata-add.component').then(
            (c) => c.RegistryMetadataAddComponent
          ),
        providers: [provideStates([RegistryMetadataState])],
      },
      {
        path: 'metadata/:recordId',
        loadComponent: () =>
          import('./pages/registry-metadata/registry-metadata.component').then((c) => c.RegistryMetadataComponent),
        providers: [provideStates([RegistryMetadataState])],
      },
      {
        path: 'contributors',
        loadComponent: () =>
          import('../project/contributors/contributors.component').then((mod) => mod.ContributorsComponent),
        data: { resourceType: ResourceType.Registration },
        providers: [provideStates([ContributorsState, ViewOnlyLinkState])],
      },
      {
        path: 'analytics',
        loadComponent: () => import('../project/analytics/analytics.component').then((mod) => mod.AnalyticsComponent),
        data: { resourceType: ResourceType.Registration },
        providers: [provideStates([AnalyticsState])],
      },
      {
        path: 'files',
        loadComponent: () =>
          import('./pages/registry-files/registry-files.component').then((c) => c.RegistryFilesComponent),
        providers: [provideStates([RegistryFilesState])],
        data: {
          context: ResourceType.Registration,
        },
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./pages/registry-resources/registry-resources.component').then(
            (mod) => mod.RegistryResourcesComponent
          ),
        providers: [provideStates([RegistryResourcesState])],
      },
    ],
  },
];
