import { Routes } from '@angular/router';

import { InstitutionsPreprintsComponent } from './pages/institutions-preprints/institutions-preprints.component';
import { InstitutionsProjectsComponent } from './pages/institutions-projects/institutions-projects.component';
import { InstitutionsRegistrationsComponent } from './pages/institutions-registrations/institutions-registrations.component';
import { InstitutionsSummaryComponent } from './pages/institutions-summary/institutions-summary.component';
import { InstitutionsUsersComponent } from './pages/institutions-users/institutions-users.component';
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
