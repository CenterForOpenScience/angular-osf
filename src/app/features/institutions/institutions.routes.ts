import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { InstitutionsComponent } from '@osf/features/institutions/institutions.component';
import { InstitutionsSearchState } from '@shared/stores';

import { InstitutionsListComponent, InstitutionsSearchComponent } from './pages';

export const routes: Routes = [
  {
    path: '',
    component: InstitutionsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: InstitutionsListComponent,
      },
      {
        path: ':institution-id',
        component: InstitutionsSearchComponent,
        providers: [provideStates([InstitutionsSearchState])],
      },
      {
        path: ':institution-id/dashboard',
        loadChildren: () => import('../admin-institutions/routes').then((inst) => inst.routes),
      },
    ],
  },
];
