import { Routes } from '@angular/router';

import { ResourceType } from '@osf/shared/enums';

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
        path: 'metadata',
        loadChildren: () => import('@osf/features/metadata/metadata.routes').then((mod) => mod.metadataRoutes),
        data: { resourceType: ResourceType.File },
      },
      {
        path: ':fileGuid',
        loadComponent: () => {
          return import('@osf/features/files/pages/file-detail/file-detail.component').then(
            (c) => c.FileDetailComponent
          );
        },

        children: [
          {
            path: 'metadata',
            loadChildren: () => import('@osf/features/metadata/metadata.routes').then((mod) => mod.metadataRoutes),
            data: { resourceType: ResourceType.File },
          },
        ],
      },
    ],
  },
];
