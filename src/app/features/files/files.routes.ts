import { Routes } from '@angular/router';

import { isFileProvider } from '@core/guards/is-file-provider.guard';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';

import { FilesContainerComponent } from './pages/files-container/files-container.component';

export const filesRoutes: Routes = [
  {
    path: '',
    component: FilesContainerComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'osfstorage',
      },
      {
        path: ':fileProvider',
        canMatch: [isFileProvider],
        data: { canonicalPathTemplate: 'files/:fileProvider' },
        loadComponent: () => import('@osf/features/files/pages/files/files.component').then((c) => c.FilesComponent),
      },
      {
        path: 'metadata',
        loadChildren: () => import('@osf/features/metadata/metadata.routes').then((mod) => mod.metadataRoutes),
        data: { resourceType: ResourceType.File },
      },
      {
        path: ':fileGuid',
        data: { canonicalPathTemplate: 'files/:fileGuid' },
        loadComponent: () => {
          return import('@osf/features/files/pages/file-detail/file-detail.component').then(
            (c) => c.FileDetailComponent
          );
        },
      },
    ],
  },
];
