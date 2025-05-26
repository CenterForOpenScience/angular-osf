import { Route } from '@angular/router';

import { TokensComponent } from './tokens.component';

export const tokensAppsRoute: Route = {
  path: 'tokens',
  component: TokensComponent,
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
