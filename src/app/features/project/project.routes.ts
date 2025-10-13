import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { viewOnlyGuard } from '@osf/core/guards';
import { ResourceType } from '@osf/shared/enums';
import { LicensesService } from '@osf/shared/services';
import {
  CitationsState,
  CollectionsState,
  ContributorsState,
  NodeLinksState,
  RelatedState,
  SubjectsState,
  ViewOnlyLinkState,
} from '@osf/shared/stores';
import { ActivityLogsState } from '@osf/shared/stores/activity-logs';

import { AnalyticsState } from '../analytics/store';
import { CollectionsModerationState } from '../moderation/store/collections-moderation';
import { RegistriesState } from '../registries/store';
import { LicensesHandlers, ProjectsHandlers, ProvidersHandlers } from '../registries/store/handlers';
import { FilesHandlers } from '../registries/store/handlers/files.handlers';

import { SettingsState } from './settings/store';

export const projectRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../project/project.component').then((mod) => mod.ProjectComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../project/overview/project-overview.component').then((mod) => mod.ProjectOverviewComponent),
        providers: [
          provideStates([
            NodeLinksState,
            CitationsState,
            CollectionsState,
            CollectionsModerationState,
            ActivityLogsState,
            SubjectsState,
            SettingsState,
          ]),
        ],
      },
      {
        path: 'metadata',
        loadChildren: () => import('@osf/features/metadata/metadata.routes').then((mod) => mod.metadataRoutes),
        providers: [provideStates([SubjectsState, ContributorsState])],
        data: { resourceType: ResourceType.Project },
        canActivate: [viewOnlyGuard],
      },
      {
        path: 'files',
        loadChildren: () => import('@osf/features/files/files.routes').then((mod) => mod.filesRoutes),
        data: { resourceType: ResourceType.Project },
      },
      {
        path: 'registrations',
        canActivate: [viewOnlyGuard],
        providers: [
          provideStates([RegistriesState]),
          ProvidersHandlers,
          ProjectsHandlers,
          LicensesService,
          LicensesHandlers,
          FilesHandlers,
        ],
        loadComponent: () =>
          import('../project/registrations/registrations.component').then((mod) => mod.RegistrationsComponent),
      },
      {
        path: 'settings',
        canActivate: [viewOnlyGuard],
        loadComponent: () => import('../project/settings/settings.component').then((mod) => mod.SettingsComponent),
        providers: [provideStates([SettingsState, ViewOnlyLinkState])],
      },
      {
        path: 'contributors',
        canActivate: [viewOnlyGuard],
        loadComponent: () => import('../contributors/contributors.component').then((mod) => mod.ContributorsComponent),
        data: { resourceType: ResourceType.Project },
        providers: [provideStates([ContributorsState, ViewOnlyLinkState])],
      },
      {
        path: 'analytics',
        loadComponent: () => import('../analytics/analytics.component').then((mod) => mod.AnalyticsComponent),
        data: { resourceType: ResourceType.Project },
        providers: [provideStates([AnalyticsState])],
      },
      {
        path: 'analytics/related-projects/:type',
        data: { resourceType: ResourceType.Project },
        loadComponent: () =>
          import('@osf/features/analytics/components/view-related-projects/view-related-projects.component').then(
            (mod) => mod.ViewRelatedProjectsComponent
          ),
        providers: [provideStates([RelatedState])],
      },
      {
        path: 'wiki',
        loadComponent: () => import('../project/wiki/wiki.component').then((mod) => mod.WikiComponent),
      },
      {
        path: 'addons',
        canActivate: [viewOnlyGuard],
        loadChildren: () =>
          import('@osf/features/project/project-addons/project-addons.routes').then((mod) => mod.projectAddonsRoutes),
      },
      {
        path: 'links',
        canActivate: [viewOnlyGuard],
        loadComponent: () =>
          import('../project/linked-services/linked-services.component').then((mod) => mod.LinkedServicesComponent),
      },
    ],
  },
];
