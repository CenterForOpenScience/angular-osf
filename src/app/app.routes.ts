import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { ProjectFilesState } from '@osf/features/project/files/store/project-files.state';

import { MyProfileResourceFiltersOptionsState } from './features/my-profile/components/filters/store';
import { MyProfileResourceFiltersState } from './features/my-profile/components/my-profile-resource-filters/store';
import { MyProfileState } from './features/my-profile/store';
import { ContributorsState } from './features/project/contributors/store';
import { ResourceFiltersOptionsState } from './features/search/components/filters/store';
import { ResourceFiltersState } from './features/search/components/resource-filters/store';
import { SearchState } from './features/search/store';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/components/root/root.component').then((mod) => mod.RootComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./features/auth/pages/sign-up/sign-up.component').then((mod) => mod.SignUpComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/pages/forgot-password/forgot-password.component').then(
            (mod) => mod.ForgotPasswordComponent
          ),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/pages/reset-password/reset-password.component').then(
            (mod) => mod.ResetPasswordComponent
          ),
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then((mod) => mod.HomeComponent),
        data: { skipBreadcrumbs: true },
      },
      {
        path: 'home-logged-out',
        loadComponent: () =>
          import('@osf/features/home/pages/home-logged-out/home-logged-out.component').then(
            (mod) => mod.HomeLoggedOutComponent
          ),
      },
      {
        path: 'support',
        loadComponent: () => import('./features/support/support.component').then((mod) => mod.SupportComponent),
      },
      {
        path: 'terms-of-use',
        loadComponent: () =>
          import('./features/static/terms-of-use/terms-of-use.component').then((mod) => mod.TermsOfUseComponent),
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./features/static/privacy-policy/privacy-policy.component').then((mod) => mod.PrivacyPolicyComponent),
      },
      {
        path: 'collections',
        loadChildren: () => import('./features/collections/collections.routes').then((mod) => mod.collectionsRoutes),
      },
      {
        path: 'meetings',
        loadComponent: () => import('./features/meetings/meetings.component').then((mod) => mod.MeetingsComponent),
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('@osf/features/meetings/pages/meetings-landing/meetings-landing.component').then(
                (mod) => mod.MeetingsLandingComponent
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('@osf/features/meetings/pages/meeting-details/meeting-details.component').then(
                (mod) => mod.MeetingDetailsComponent
              ),
          },
        ],
      },
      {
        path: 'my-projects',
        loadComponent: () =>
          import('./features/my-projects/my-projects.component').then((mod) => mod.MyProjectsComponent),
      },
      {
        path: 'my-projects/:id',
        loadComponent: () => import('@osf/features/project/project.component').then((mod) => mod.ProjectComponent),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'overview',
          },
          {
            path: 'overview',
            loadComponent: () =>
              import('@osf/features/project/overview/project-overview.component').then(
                (mod) => mod.ProjectOverviewComponent
              ),
          },
          {
            path: 'metadata',
            loadChildren: () =>
              import('@osf/features/project/metadata/project-metadata.routes').then((mod) => mod.projectMetadataRoutes),
          },
          {
            path: 'files',
            loadComponent: () =>
              import('@osf/features/project/files/project-files.component').then((mod) => mod.ProjectFilesComponent),
            providers: [provideStates([ProjectFilesState])],
          },
          {
            path: 'files/:fileGuid',
            loadComponent: () =>
              import('@osf/features/project/files/components/file-detail/file-detail.component').then(
                (mod) => mod.FileDetailComponent
              ),
          },
          {
            path: 'registrations',
            loadComponent: () =>
              import('@osf/features/project/registrations/registrations.component').then(
                (mod) => mod.RegistrationsComponent
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./features/project/settings/settings.component').then((mod) => mod.SettingsComponent),
          },
          {
            path: 'contributors',
            loadComponent: () =>
              import('@osf/features/project/contributors/contributors.component').then(
                (mod) => mod.ContributorsComponent
              ),
            providers: [provideStates([ContributorsState])],
          },
          {
            path: 'analytics',
            loadComponent: () =>
              import('@osf/features/project/analytics/analytics.component').then((mod) => mod.AnalyticsComponent),
          },
          {
            path: 'wiki',
            loadComponent: () => import('@osf/features/project/wiki/wiki.component').then((mod) => mod.WikiComponent),
          },
          {
            path: 'addons',
            loadChildren: () =>
              import('./features/project/addons/constants/addons.routes').then((mod) => mod.addonsRoutes),
          },
        ],
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then((mod) => mod.settingsRoutes),
      },
      {
        path: 'preprints',
        loadChildren: () =>
          import('./features/preprints/constants/preprints.routes').then((mod) => mod.preprintsRoutes),
      },
      {
        path: 'search',
        loadComponent: () => import('./features/search/search.component').then((mod) => mod.SearchComponent),
        providers: [provideStates([ResourceFiltersState, ResourceFiltersOptionsState, SearchState])],
      },
      {
        path: 'my-profile',
        loadComponent: () => import('./features/my-profile/my-profile.component').then((mod) => mod.MyProfileComponent),
        providers: [
          provideStates([MyProfileResourceFiltersState, MyProfileResourceFiltersOptionsState, MyProfileState]),
        ],
      },
      {
        path: 'confirm/:userId/:token',
        loadComponent: () => import('./features/home/home.component').then((mod) => mod.HomeComponent),
        data: { skipBreadcrumbs: true },
      },
      {
        path: 'forbidden',
        loadComponent: () =>
          import('./core/components/forbidden-page/forbidden-page.component').then((mod) => mod.ForbiddenPageComponent),
        data: { skipBreadcrumbs: true },
      },
      {
        path: 'request-access/:projectId',
        loadComponent: () =>
          import('./core/components/request-access/request-access.component').then((mod) => mod.RequestAccessComponent),
        data: { skipBreadcrumbs: true },
      },
      {
        path: '**',
        loadComponent: () =>
          import('./core/components/page-not-found/page-not-found.component').then((mod) => mod.PageNotFoundComponent),
        data: { skipBreadcrumbs: true },
      },
    ],
  },
];
