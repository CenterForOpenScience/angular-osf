import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';

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
        path: ':institutionId',
        component: InstitutionsSearchComponent,
      },
      {
        path: ':institutionId/dashboard',
        canActivate: [authGuard],
        loadChildren: () => import('../admin-institutions/routes').then((inst) => inst.routes),
      },
    ],
  },
];
