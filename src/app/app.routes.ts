import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { BookmarksState, ProjectsState } from '@shared/stores';

import { authGuard, redirectIfLoggedInGuard } from './core/guards';
import { MyProfileResourceFiltersOptionsState } from './features/my-profile/components/filters/store';
import { MyProfileResourceFiltersState } from './features/my-profile/components/my-profile-resource-filters/store';
import { MyProfileState } from './features/my-profile/store';
import { PreprintState } from './features/preprints/store/preprint';
import { RegistriesState } from './features/registries/store';
import { LicensesHandlers, ProjectsHandlers, ProvidersHandlers } from './features/registries/store/handlers';
import { FilesHandlers } from './features/registries/store/handlers/files.handlers';
import { ResourceFiltersOptionsState } from './features/search/components/filters/store';
import { ResourceFiltersState } from './features/search/components/resource-filters/store';
import { SearchState } from './features/search/store';
import { LicensesService } from './shared/services';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/components/root/root.component').then((mod) => mod.RootComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [redirectIfLoggedInGuard],
        loadComponent: () => import('@osf/features/home/home.component').then((mod) => mod.HomeComponent),
        data: { skipBreadcrumbs: true },
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/home/pages/dashboard/dashboard.component').then((mod) => mod.DashboardComponent),
        data: { skipBreadcrumbs: true },
        canActivate: [authGuard],
      },
      {
        path: 'confirm/:userId/:token',
        loadComponent: () => import('./features/home/home.component').then((mod) => mod.HomeComponent),
        data: { skipBreadcrumbs: true },
      },
      {
        path: 'register',
        canActivate: [redirectIfLoggedInGuard],
        loadComponent: () =>
          import('./features/auth/pages/sign-up/sign-up.component').then((mod) => mod.SignUpComponent),
        data: { skipBreadcrumbs: true },
      },
      {
        path: 'forgotpassword',
        loadComponent: () =>
          import('./features/auth/pages/forgot-password/forgot-password.component').then(
            (mod) => mod.ForgotPasswordComponent
          ),
        data: { skipBreadcrumbs: true },
      },
      {
        path: 'resetpassword/:userId/:token',
        loadComponent: () =>
          import('./features/auth/pages/reset-password/reset-password.component').then(
            (mod) => mod.ResetPasswordComponent
          ),
        data: { skipBreadcrumbs: true },
      },
      {
        path: 'search',
        loadComponent: () => import('./features/search/search.component').then((mod) => mod.SearchComponent),
        providers: [provideStates([ResourceFiltersState, ResourceFiltersOptionsState, SearchState])],
      },
      {
        path: 'my-projects',
        loadComponent: () =>
          import('./features/my-projects/my-projects.component').then((mod) => mod.MyProjectsComponent),
        providers: [provideStates([BookmarksState])],
        canActivate: [authGuard],
      },
      {
        path: 'my-registrations',
        canActivate: [authGuard],
        loadComponent: () => import('@osf/features/registries/pages').then((c) => c.MyRegistrationsComponent),
        providers: [
          provideStates([RegistriesState]),
          ProvidersHandlers,
          ProjectsHandlers,
          LicensesService,
          LicensesHandlers,
          FilesHandlers,
        ],
      },
      {
        path: 'my-preprints',
        canActivate: [authGuard],
        loadComponent: () =>
          import('@osf/features/preprints/pages/my-preprints/my-preprints.component').then(
            (m) => m.MyPreprintsComponent
          ),
        providers: [provideStates([PreprintState])],
      },
      {
        path: 'project/:id',
        loadChildren: () => import('./features/project/project.routes').then((mod) => mod.projectRoutes),
        providers: [provideStates([ProjectsState, BookmarksState])],
        canActivate: [authGuard],
      },
      {
        path: 'preprints',
        loadChildren: () => import('./features/preprints/preprints.routes').then((mod) => mod.preprintsRoutes),
      },
      {
        path: 'preprints/:providerId/:id',
        loadComponent: () =>
          import('@osf/features/preprints/pages/preprint-details/preprint-details.component').then(
            (c) => c.PreprintDetailsComponent
          ),
      },
      {
        path: 'registries',
        loadChildren: () => import('./features/registries/registries.routes').then((mod) => mod.registriesRoutes),
      },
      {
        path: 'registries/:id',
        loadChildren: () => import('./features/registry/registry.routes').then((mod) => mod.registryRoutes),
        providers: [provideStates([BookmarksState])],
        canActivate: [authGuard],
      },
      {
        path: 'my-profile',
        loadComponent: () => import('./features/my-profile/my-profile.component').then((mod) => mod.MyProfileComponent),
        providers: [
          provideStates([MyProfileResourceFiltersState, MyProfileResourceFiltersOptionsState, MyProfileState]),
        ],
        canActivate: [authGuard],
      },
      {
        path: 'institutions',
        loadChildren: () => import('./features/institutions/institutions.routes').then((r) => r.routes),
      },
      {
        path: 'collections',
        loadChildren: () => import('./features/collections/collections.routes').then((mod) => mod.collectionsRoutes),
      },
      {
        path: 'meetings',
        loadChildren: () => import('./features/meetings/meetings.routes').then((mod) => mod.meetingsRoutes),
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then((mod) => mod.settingsRoutes),
        canActivate: [authGuard],
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
        path: 'forbidden',
        loadComponent: () =>
          import('./core/components/forbidden-page/forbidden-page.component').then((mod) => mod.ForbiddenPageComponent),
        data: { skipBreadcrumbs: true },
      },
      {
        path: 'request-access/:id',
        loadComponent: () =>
          import('./core/components/request-access/request-access.component').then((mod) => mod.RequestAccessComponent),
        data: { skipBreadcrumbs: true },
      },
      {
        path: 'files/:fileGuid',
        loadComponent: () =>
          import('@osf/features/files/pages/file-detail/file-detail.component').then((c) => c.FileDetailComponent),
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
