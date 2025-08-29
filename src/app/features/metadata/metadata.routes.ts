import { Routes } from '@angular/router';

import { MetadataComponent } from './metadata.component';

export const metadataRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'osf',
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/add-metadata/add-metadata.component').then((c) => c.AddMetadataComponent),
  },
  {
    path: ':recordId',
    component: MetadataComponent,
  },
];
