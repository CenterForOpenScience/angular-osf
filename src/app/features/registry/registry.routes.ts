import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { ResourceType } from '@osf/shared/enums';
import { ContributorsState, DuplicatesState, ViewOnlyLinkState } from '@osf/shared/stores';

import { AnalyticsState } from '../project/analytics/store';

import { RegistryComponentsState } from './store/registry-components';
import { RegistryLinksState } from './store/registry-links';
import { RegistryMetadataState } from './store/registry-metadata';
import { RegistryOverviewState } from './store/registry-overview';
import { RegistryResourcesState } from './store/registry-resources';
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
        path: 'links',
        loadComponent: () =>
          import('./pages/registry-links/registry-links.component').then((c) => c.RegistryLinksComponent),
        providers: [provideStates([RegistryLinksState])],
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
        path: 'analytics/duplicates',
        data: { resourceType: ResourceType.Registration },
        loadComponent: () =>
          import('../project/analytics/components/view-duplicates/view-duplicates.component').then(
            (mod) => mod.ViewDuplicatesComponent
          ),
        providers: [provideStates([DuplicatesState])],
      },
      {
        path: 'files',
        loadChildren: () => import('@osf/features/files/files.routes').then((mod) => mod.filesRoutes),
        data: { resourceType: ResourceType.Registration },
      },
      {
        path: 'components',
        loadComponent: () =>
          import('./pages/registry-components/registry-components.component').then(
            (c) => c.RegistryComponentsComponent
          ),
        providers: [provideStates([RegistryComponentsState, RegistryLinksState])],
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./pages/registry-resources/registry-resources.component').then(
            (mod) => mod.RegistryResourcesComponent
          ),
        providers: [provideStates([RegistryResourcesState])],
      },
      {
        path: 'wiki',
        loadComponent: () =>
          import('./pages/registry-wiki/registry-wiki.component').then((c) => c.RegistryWikiComponent),
      },
    ],
  },
];
