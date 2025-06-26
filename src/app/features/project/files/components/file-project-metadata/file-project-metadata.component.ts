import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProjectFilesSelectors } from '@osf/features/project/files/store';

@Component({
  selector: 'osf-file-project-metadata',
  imports: [DatePipe, TranslatePipe, Skeleton],
  templateUrl: './file-project-metadata.component.html',
  styleUrl: './file-project-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileProjectMetadataComponent {
  projectMetadata = select(ProjectFilesSelectors.getProjectMetadata);
  contributors = select(ProjectFilesSelectors.getProjectContributors);
  isProjectMetadataLoading = select(ProjectFilesSelectors.isProjectMetadataLoading);
  isProjectContributorsLoading = select(ProjectFilesSelectors.isProjectContributorsLoading);
}
