import { Routes } from '@angular/router';
import { provideStates } from '@ngxs/store';
import { ResourceFiltersState } from '@shared/components/resources/resource-filters/store/resource-filters.state';
import { ResourceFiltersOptionsState } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.state';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/components/root/root.component').then(
        (mod) => mod.RootComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./features/auth/sign-up/sign-up.component').then(
            (mod) => mod.SignUpComponent,
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import(
            './features/auth/forgot-password/forgot-password.component'
          ).then((mod) => mod.ForgotPasswordComponent),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import(
            './features/auth/reset-password/reset-password.component'
          ).then((mod) => mod.ResetPasswordComponent),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then(
            (mod) => mod.HomeComponent,
          ),
      },
      {
        path: 'home-logged-out',
        loadComponent: () =>
          import('./features/home/logged-out/home-logged-out.component').then(
            (mod) => mod.HomeLoggedOutComponent,
          ),
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./features/support/support.component').then(
            (mod) => mod.SupportComponent,
          ),
      },
      {
        path: 'terms-of-use',
        loadComponent: () =>
          import('./features/terms-of-use/terms-of-use.component').then(
            (mod) => mod.TermsOfUseComponent,
          ),
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./features/privacy-policy/privacy-policy.component').then(
            (mod) => mod.PrivacyPolicyComponent,
          ),
      },
      {
        path: 'my-projects',
        loadComponent: () =>
          import('./features/my-projects/my-projects.component').then(
            (mod) => mod.MyProjectsComponent,
          ),
      },
      {
        path: 'my-projects/:id',
        loadComponent: () =>
          import('./features/my-projects/project/project.component').then(
            (mod) => mod.ProjectComponent,
          ),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'overview',
          },
          {
            path: 'overview',
            loadComponent: () =>
              import(
                './features/my-projects/project/overview/project-overview.component'
              ).then((mod) => mod.ProjectOverviewComponent),
          },
          {
            path: 'metadata',
            loadComponent: () =>
              import(
                './features/my-projects/project/metadata/project-metadata.component'
              ).then((mod) => mod.ProjectMetadataComponent),
          },
          {
            path: 'files',
            loadComponent: () =>
              import(
                './features/my-projects/project/files/project-files.component'
              ).then((mod) => mod.ProjectFilesComponent),
          },
          {
            path: 'files/:fileId',
            loadComponent: () =>
              import(
                './features/my-projects/project/files/file-detail/file-detail.component'
              ).then((mod) => mod.FileDetailComponent),
          },
          {
            path: 'registrations',
            loadComponent: () =>
              import(
                '@osf/features/my-projects/project/registrations/registrations.component'
              ).then((mod) => mod.RegistrationsComponent),
          },
        ],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then(
            (mod) => mod.settingsRoutes,
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./features/search/search.component').then(
            (mod) => mod.SearchComponent,
          ),
        providers: [
          provideStates([ResourceFiltersState, ResourceFiltersOptionsState]),
        ],
      },
    ],
  },
];
