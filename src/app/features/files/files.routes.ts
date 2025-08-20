import { Routes } from '@angular/router';

import { FilesContainerComponent } from './pages/files-container/files-container.component';

export const filesRoutes: Routes = [
  {
    path: '',
    component: FilesContainerComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('@osf/features/files/pages/files/files.component').then((c) => c.FilesComponent),
      },
      {
        path: ':fileGuid',
        loadComponent: () =>
          import('@osf/features/files/pages/file-detail/file-detail.component').then((c) => c.FileDetailComponent),
        children: [
          {
            path: 'metadata',
            loadComponent: () =>
              import('@osf/features/files/pages/community-metadata/community-metadata.component').then(
                (c) => c.CommunityMetadataComponent
              ),
          },
        ],
      },
    ],
  },
];
