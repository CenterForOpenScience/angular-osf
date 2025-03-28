import { Route } from '@angular/router';
import { TokensComponent } from '@osf/features/settings/tokens/tokens.component';

export const tokensAppsRoute: Route = {
  path: 'tokens',
  component: TokensComponent,
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./tokens-list/tokens-list.component').then(
          (c) => c.TokensListComponent,
        ),
    },
    {
      path: ':id/details',
      loadComponent: () =>
        import('./token-details/token-details.component').then(
          (c) => c.TokenDetailsComponent,
        ),
    },
  ],
};
