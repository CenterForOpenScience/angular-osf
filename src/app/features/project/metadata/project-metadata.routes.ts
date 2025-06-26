import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { ContributorsState } from '@osf/shared/components/contributors/store';

import { ProjectMetadataComponent } from './project-metadata.component';

export const projectMetadataRoutes: Routes = [
  {
    path: '',
    component: ProjectMetadataComponent,
    providers: [provideStates([ContributorsState])],
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
