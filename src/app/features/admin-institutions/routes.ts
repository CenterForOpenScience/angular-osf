import { Routes } from '@angular/router';

import {
  InstitutionsPreprintsComponent,
  InstitutionsProjectsComponent,
  InstitutionsRegistrationsComponent,
  InstitutionsSummaryComponent,
  InstitutionsUsersComponent,
} from '@osf/features/admin-institutions/pages';

import { AdminInstitutionsComponent } from './admin-institutions.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminInstitutionsComponent,
    children: [
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full',
      },
      {
        path: 'summary',
        component: InstitutionsSummaryComponent,
      },
      {
        path: 'users',
        component: InstitutionsUsersComponent,
        data: { scrollToTop: false },
      },
      {
        path: 'projects',
        component: InstitutionsProjectsComponent,
        data: { scrollToTop: false },
      },
      {
        path: 'registrations',
        component: InstitutionsRegistrationsComponent,
        data: { scrollToTop: false },
      },
      {
        path: 'preprints',
        component: InstitutionsPreprintsComponent,
        data: { scrollToTop: false },
      },
    ],
  },
];
