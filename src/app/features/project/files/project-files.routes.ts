import { Routes } from '@angular/router';

import { ProjectFilesContainerComponent } from './pages/project-files-container/project-files-container.component';

export const projectFilesRoutes: Routes = [
  {
    path: '',
    component: ProjectFilesContainerComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@osf/features/project/files/pages/project-files/project-files.component').then(
            (c) => c.ProjectFilesComponent
          ),
      },
      {
        path: ':fileGuid',
        loadComponent: () =>
          import('@osf/features/project/files/pages/file-detail/file-detail.component').then(
            (c) => c.FileDetailComponent
          ),
        children: [
          {
            path: 'metadata',
            loadComponent: () =>
              import('@osf/features/project/files/pages/community-metadata/community-metadata.component').then(
                (c) => c.CommunityMetadataComponent
              ),
          },
        ],
      },
    ],
  },
];
