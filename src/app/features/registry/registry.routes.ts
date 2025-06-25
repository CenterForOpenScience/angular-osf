import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { RegistryOverviewState } from '@osf/features/registry/store/registry-overview';

import { RegistryComponent } from './registry.component';

export const registryRoutes: Routes = [
  {
    path: '',
    component: RegistryComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () => import('@osf/features/registry/pages').then((c) => c.RegistryOverviewComponent),
        providers: [provideStates([RegistryOverviewState])],
      },
    ],
  },
];
