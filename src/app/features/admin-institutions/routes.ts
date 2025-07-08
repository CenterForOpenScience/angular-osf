import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import {
  InstitutionsPreprintsComponent,
  InstitutionsProjectsComponent,
  InstitutionsRegistrationsComponent,
  InstitutionsSummaryComponent,
  InstitutionsUsersComponent,
} from '@osf/features/admin-institutions/pages';

import { AdminInstitutionsComponent } from './admin-institutions.component';

import { InstitutionsAdminState } from 'src/app/features/admin-institutions/store';

export const routes: Routes = [
  {
    path: '',
    component: AdminInstitutionsComponent,
    providers: [provideStates([InstitutionsAdminState])],
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
      },
      {
        path: 'projects',
        component: InstitutionsProjectsComponent,
      },
      {
        path: 'registrations',
        component: InstitutionsRegistrationsComponent,
      },
      {
        path: 'preprints',
        component: InstitutionsPreprintsComponent,
      },
    ],
  },
];
