import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { ContributorsState } from '@osf/features/project/contributors/store';
import { ProjectMetadataComponent } from '@osf/features/project/metadata/project-metadata.component';

export const projectMetadataRoutes = [
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
] as Routes;
