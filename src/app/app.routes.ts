import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/components/root/root.component').then(
        (mod) => mod.RootComponent,
      ),
    children: [
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./features/auth/sign-up/sign-up.component').then(
            (mod) => mod.SignUpComponent,
          ),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then(
            (mod) => mod.HomeComponent,
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
    ],
  },
];
