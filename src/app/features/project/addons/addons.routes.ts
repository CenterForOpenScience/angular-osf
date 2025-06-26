import { Routes } from '@angular/router';

export const addonsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./addons.component').then((mod) => mod.AddonsComponent),
  },
  {
    path: 'connect-addon',
    loadComponent: () =>
      import('./components/connect-configured-addon/connect-configured-addon.component').then(
        (mod) => mod.ConnectConfiguredAddonComponent
      ),
  },
  {
    path: 'configure-addon',
    loadComponent: () =>
      import('./components/configure-addon/configure-addon.component').then((mod) => mod.ConfigureAddonComponent),
  },
];
