import { Route } from '@angular/router';
import { DeveloperAppsContainerComponent } from '@osf/features/settings/developer-apps/developer-apps-container.component';

export const developerAppsRoute: Route = {
  path: 'developer-apps',
  component: DeveloperAppsContainerComponent,
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./developer-apps-list/developer-apps-list.component').then(
          (c) => c.DeveloperAppsListComponent,
        ),
    },
    {
      path: ':id/details',
      loadComponent: () =>
        import('./developer-app-details/developer-app-details.component').then(
          (c) => c.DeveloperAppDetailsComponent,
        ),
    },
  ],
};
