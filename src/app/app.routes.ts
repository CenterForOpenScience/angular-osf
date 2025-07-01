import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { MyProfileResourceFiltersOptionsState } from './features/my-profile/components/filters/store';
import { MyProfileResourceFiltersState } from './features/my-profile/components/my-profile-resource-filters/store';
import { MyProfileState } from './features/my-profile/store';
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
        data: { skipBreadcrumbs: true },
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/pages/forgot-password/forgot-password.component').then(
            (mod) => mod.ForgotPasswordComponent
          ),
        data: { skipBreadcrumbs: true },
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/pages/reset-password/reset-password.component').then(
            (mod) => mod.ResetPasswordComponent
          ),
        data: { skipBreadcrumbs: true },
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
        data: { skipBreadcrumbs: true },
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
        loadChildren: () => import('./features/project/project.routes').then((mod) => mod.projectRoutes),
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
        path: 'institutions',
        loadChildren: () => import('./features/institutions/institutions.routes').then((r) => r.routes),
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
        path: 'registries',
        loadChildren: () => import('./features/registries/registries.routes').then((mod) => mod.registriesRoutes),
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
