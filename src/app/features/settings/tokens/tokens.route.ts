import { provideStates } from '@ngxs/store';

import { Route } from '@angular/router';

import { TokensState } from './store';
import { TokensComponent } from './tokens.component';

export const tokensAppsRoute: Route = {
  path: 'tokens',
  component: TokensComponent,
  providers: [provideStates([TokensState])],
  children: [
    {
      path: '',
      loadComponent: () => import('./pages/tokens-list/tokens-list.component').then((c) => c.TokensListComponent),
    },
    {
      path: ':id/details',
      loadComponent: () => import('./pages/token-details/token-details.component').then((c) => c.TokenDetailsComponent),
    },
  ],
};
