import { Routes } from '@angular/router';

import { ProjectMetadataComponent } from './project-metadata.component';

export const projectMetadataRoutes: Routes = [
  {
    path: '',
    component: ProjectMetadataComponent,
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/add-metadata/add-metadata.component').then((c) => c.AddMetadataComponent),
  },
  {
    path: ':recordId',
    component: ProjectMetadataComponent,
  },
];
