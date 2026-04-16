import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { viewOnlyGuard } from '@core/guards/view-only.guard';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ActivityLogsState } from '@osf/shared/stores/activity-logs';
import { BookmarksState } from '@osf/shared/stores/bookmarks';
import { CitationsState } from '@osf/shared/stores/citations';
import { CollectionsState } from '@osf/shared/stores/collections';
import { DuplicatesState } from '@osf/shared/stores/duplicates';
import { LinkedProjectsState } from '@osf/shared/stores/linked-projects';
import { NodeLinksState } from '@osf/shared/stores/node-links';
import { SubjectsState } from '@osf/shared/stores/subjects';
import { ViewOnlyLinkState } from '@osf/shared/stores/view-only-links';

import { AnalyticsState } from '../analytics/store';
import { CollectionsModerationState } from '../moderation/store/collections-moderation';

import { ProjectOverviewState } from './overview/store';
import { RegistrationsState } from './registrations/store';
import { SettingsState } from './settings/store';

export const projectRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../project/project.component').then((mod) => mod.ProjectComponent),
    providers: [provideStates([BookmarksState, ProjectOverviewState])],
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
        data: { canonicalPath: 'overview' },
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
        providers: [provideStates([SubjectsState, CollectionsState])],
        data: { resourceType: ResourceType.Project, canonicalPath: 'metadata/osf' },
        canActivate: [viewOnlyGuard],
      },
      {
        path: 'files',
        loadChildren: () => import('@osf/features/files/files.routes').then((mod) => mod.filesRoutes),
        data: { resourceType: ResourceType.Project, canonicalPath: 'files/osfstorage' },
      },
      {
        path: 'registrations',
        canActivate: [viewOnlyGuard],
        providers: [provideStates([RegistrationsState])],
        loadComponent: () =>
          import('../project/registrations/registrations.component').then((mod) => mod.RegistrationsComponent),
        data: { canonicalPath: 'registrations' },
      },
      {
        path: 'settings',
        canActivate: [viewOnlyGuard],
        loadComponent: () => import('../project/settings/settings.component').then((mod) => mod.SettingsComponent),
        data: { canonicalPath: 'settings' },
        providers: [provideStates([SettingsState, ViewOnlyLinkState])],
      },
      {
        path: 'contributors',
        canActivate: [viewOnlyGuard],
        loadComponent: () => import('../contributors/contributors.component').then((mod) => mod.ContributorsComponent),
        data: { resourceType: ResourceType.Project, canonicalPath: 'contributors' },
        providers: [provideStates([ViewOnlyLinkState])],
      },
      {
        path: 'analytics',
        loadComponent: () => import('../analytics/analytics.component').then((mod) => mod.AnalyticsComponent),
        data: { resourceType: ResourceType.Project, canonicalPath: 'analytics' },
        providers: [provideStates([AnalyticsState])],
      },
      {
        path: 'analytics/linked-projects',
        data: { resourceType: ResourceType.Project, canonicalPath: 'analytics/linked-projects' },
        loadComponent: () =>
          import('../analytics/components/view-linked-projects/view-linked-projects.component').then(
            (mod) => mod.ViewLinkedProjectsComponent
          ),
        providers: [provideStates([LinkedProjectsState])],
      },
      {
        path: 'analytics/duplicates',
        data: { resourceType: ResourceType.Project, canonicalPath: 'analytics/duplicates' },
        loadComponent: () =>
          import('../analytics/components/view-duplicates/view-duplicates.component').then(
            (mod) => mod.ViewDuplicatesComponent
          ),
        providers: [provideStates([DuplicatesState])],
      },
      {
        path: 'wiki/:wikiName',
        loadComponent: () =>
          import('./legacy-wiki-redirect/legacy-wiki-redirect.component').then((m) => m.LegacyWikiRedirectComponent),
        data: { canonicalPath: 'wiki' },
      },
      {
        path: 'wiki',
        loadComponent: () => import('../project/wiki/wiki.component').then((mod) => mod.WikiComponent),
        data: { canonicalPath: 'wiki' },
      },
      {
        path: 'addons',
        canActivate: [viewOnlyGuard],
        data: { canonicalPath: 'addons' },
        loadChildren: () =>
          import('@osf/features/project/project-addons/project-addons.routes').then((mod) => mod.projectAddonsRoutes),
      },
      {
        path: 'links',
        canActivate: [viewOnlyGuard],
        data: { canonicalPath: 'links' },
        loadComponent: () =>
          import('../project/linked-services/linked-services.component').then((mod) => mod.LinkedServicesComponent),
      },
    ],
  },
];
