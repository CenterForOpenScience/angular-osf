import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { InstitutionsComponent } from '@osf/features/institutions/institutions.component';
import { InstitutionsSearchComponent } from '@osf/features/institutions/pages/institutions-search/institutions-search.component';
import { InstitutionsSearchState } from '@shared/stores';

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
