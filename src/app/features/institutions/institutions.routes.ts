import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { authGuard } from '@core/guards';
import { InstitutionsSearchState } from '@shared/stores/institutions-search';

import { InstitutionsComponent } from './institutions.component';
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
        canActivate: [authGuard],
        loadChildren: () => import('../admin-institutions/routes').then((inst) => inst.routes),
      },
    ],
  },
];
