import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { ResourceFiltersOptionsState } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.state';
import { ResourceFiltersState } from '@shared/components/resources/resource-filters/store/resource-filters.state';

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
        loadComponent: () => import('./features/auth/sign-up/sign-up.component').then((mod) => mod.SignUpComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password.component').then(
            (mod) => mod.ForgotPasswordComponent
          ),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password.component').then((mod) => mod.ResetPasswordComponent),
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then((mod) => mod.HomeComponent),
      },
      {
        path: 'home-logged-out',
        loadComponent: () =>
          import('@osf/features/home/components/logged-out/home-logged-out.component').then(
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
          import('./features/terms-of-use/terms-of-use.component').then((mod) => mod.TermsOfUseComponent),
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./features/privacy-policy/privacy-policy.component').then((mod) => mod.PrivacyPolicyComponent),
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
            loadComponent: () =>
              import('@osf/features/project/metadata/project-metadata.component').then(
                (mod) => mod.ProjectMetadataComponent
              ),
          },
          {
            path: 'files',
            loadComponent: () =>
              import('@osf/features/project/files/project-files.component').then((mod) => mod.ProjectFilesComponent),
          },
          {
            path: 'files/:fileId',
            loadComponent: () =>
              import('@osf/features/project/files/file-detail/file-detail.component').then(
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
            path: 'analytics',
            loadComponent: () =>
              import('@osf/features/project/analytics/analytics.component').then((mod) => mod.AnalyticsComponent),
          },
        ],
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then((mod) => mod.settingsRoutes),
      },
      {
        path: 'search',
        loadComponent: () => import('./features/search/search.component').then((mod) => mod.SearchComponent),
        providers: [provideStates([ResourceFiltersState, ResourceFiltersOptionsState])],
      },
      {
        path: 'my-profile',
        loadComponent: () => import('./features/my-profile/my-profile.component').then((mod) => mod.MyProfileComponent),
        providers: [provideStates([ResourceFiltersState, ResourceFiltersOptionsState])],
      },
      {
        path: 'confirm/:userId/:emailId',
        loadComponent: () => import('./features/home/home.component').then((mod) => mod.HomeComponent),
      },
    ],
  },
];
