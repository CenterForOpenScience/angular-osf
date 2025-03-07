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
    ],
  },
];
