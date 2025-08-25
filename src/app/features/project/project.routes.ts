import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { ResourceType } from '@osf/shared/enums';
import {
  CitationsState,
  CollectionsState,
  ContributorsState,
  DuplicatesState,
  NodeLinksState,
  SubjectsState,
  ViewOnlyLinkState,
} from '@osf/shared/stores';
import { ActivityLogsState } from '@osf/shared/stores/activity-logs';

import { CollectionsModerationState } from '../moderation/store/collections-moderation';
import { NotificationSubscriptionState } from '../settings/notifications/store';

import { AnalyticsState } from './analytics/store';
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
          ]),
        ],
      },
      {
        path: 'metadata',
        loadChildren: () =>
          import('../project/metadata/project-metadata.routes').then((mod) => mod.projectMetadataRoutes),
        providers: [provideStates([ContributorsState, SubjectsState])],
      },
      {
        path: 'files',
        loadChildren: () => import('@osf/features/files/files.routes').then((mod) => mod.filesRoutes),
        data: { resourceType: ResourceType.Project },
      },
      {
        path: 'registrations',
        loadComponent: () =>
          import('../project/registrations/registrations.component').then((mod) => mod.RegistrationsComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('../project/settings/settings.component').then((mod) => mod.SettingsComponent),
        providers: [provideStates([SettingsState, ViewOnlyLinkState, NotificationSubscriptionState])],
      },
      {
        path: 'contributors',
        loadComponent: () =>
          import('../project/contributors/contributors.component').then((mod) => mod.ContributorsComponent),
        data: { resourceType: ResourceType.Project },
        providers: [provideStates([ContributorsState, ViewOnlyLinkState])],
      },
      {
        path: 'analytics',
        loadComponent: () => import('../project/analytics/analytics.component').then((mod) => mod.AnalyticsComponent),
        data: { resourceType: ResourceType.Project },
        providers: [provideStates([AnalyticsState])],
      },
      {
        path: 'analytics/duplicates',
        data: { resourceType: ResourceType.Project },
        loadComponent: () =>
          import('../project/analytics/components/view-duplicates/view-duplicates.component').then(
            (mod) => mod.ViewDuplicatesComponent
          ),
        providers: [provideStates([DuplicatesState])],
      },
      {
        path: 'wiki',
        loadComponent: () => import('../project/wiki/wiki.component').then((mod) => mod.WikiComponent),
      },
      {
        path: 'addons',
        loadChildren: () => import('../project/addons/addons.routes').then((mod) => mod.addonsRoutes),
      },
    ],
  },
];
