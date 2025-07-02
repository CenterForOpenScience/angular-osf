import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { InstitutionsComponent } from '@osf/features/institutions/institutions.component';
import { InstitutionsSearchState } from '@shared/stores';

import { InstitutionsSearchComponent } from './pages';

export const routes: Routes = [
  {
    path: '',
    component: InstitutionsComponent,
  },
  {
    path: ':institution-id',
    component: InstitutionsSearchComponent,
    providers: [provideStates([InstitutionsSearchState])],
  },
];
