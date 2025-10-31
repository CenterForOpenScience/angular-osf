import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { viewOnlyGuard } from '@core/guards/view-only.guard';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CitationsState } from '@osf/shared/stores/citations';
import { DuplicatesState } from '@osf/shared/stores/duplicates';
import { SubjectsState } from '@osf/shared/stores/subjects';
import { ViewOnlyLinkState } from '@osf/shared/stores/view-only-links';
import { ActivityLogsState } from '@shared/stores/activity-logs';

import { AnalyticsState } from '../analytics/store';
import { LicensesService } from '../registries/services';
import { RegistriesState } from '../registries/store';
import { LicensesHandlers, ProjectsHandlers, ProvidersHandlers } from '../registries/store/handlers';
import { FilesHandlers } from '../registries/store/handlers/files.handlers';

import { RegistryComponentsState } from './store/registry-components';
import { RegistryLinksState } from './store/registry-links';
import { RegistryOverviewState } from './store/registry-overview';
import { RegistryResourcesState } from './store/registry-resources';
import { RegistryComponent } from './registry.component';

export const registryRoutes: Routes = [
  {
    path: '',
    component: RegistryComponent,
    providers: [provideStates([RegistryOverviewState, ActivityLogsState])],
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
        providers: [
          provideStates([RegistriesState, SubjectsState, CitationsState]),
          ProvidersHandlers,
          ProjectsHandlers,
          LicensesHandlers,
          FilesHandlers,
          LicensesService,
        ],
      },
      {
        path: 'metadata',
        loadChildren: () => import('@osf/features/metadata/metadata.routes').then((mod) => mod.metadataRoutes),
        providers: [provideStates([SubjectsState])],
        data: { resourceType: ResourceType.Registration },
        canActivate: [viewOnlyGuard],
      },
      {
        path: 'links',
        canActivate: [viewOnlyGuard],
        loadComponent: () =>
          import('./pages/registry-links/registry-links.component').then((c) => c.RegistryLinksComponent),
        providers: [provideStates([RegistryLinksState])],
      },
      {
        path: 'contributors',
        canActivate: [viewOnlyGuard],
        loadComponent: () => import('../contributors/contributors.component').then((mod) => mod.ContributorsComponent),
        data: { resourceType: ResourceType.Registration },
        providers: [provideStates([ViewOnlyLinkState])],
      },
      {
        path: 'analytics',
        loadComponent: () => import('../analytics/analytics.component').then((mod) => mod.AnalyticsComponent),
        data: { resourceType: ResourceType.Registration },
        providers: [provideStates([AnalyticsState])],
      },
      {
        path: 'analytics/duplicates',
        data: { resourceType: ResourceType.Registration },
        loadComponent: () =>
          import('../analytics/components/view-duplicates/view-duplicates.component').then(
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
        canActivate: [viewOnlyGuard],
        loadComponent: () =>
          import('./pages/registry-components/registry-components.component').then(
            (c) => c.RegistryComponentsComponent
          ),
        providers: [provideStates([RegistryComponentsState, RegistryLinksState])],
      },
      {
        path: 'resources',
        canActivate: [viewOnlyGuard],
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
      {
        path: 'recent-activity',
        loadComponent: () =>
          import('./pages/registration-recent-activity/registration-recent-activity.component').then(
            (c) => c.RegistrationRecentActivityComponent
          ),
      },
    ],
  },
];
