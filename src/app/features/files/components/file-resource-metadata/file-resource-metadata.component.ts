import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';

import { FilesSelectors } from '../../store';

@Component({
  selector: 'osf-file-resource-metadata',
  imports: [DatePipe, TranslatePipe, Skeleton, ContributorsListComponent],
  templateUrl: './file-resource-metadata.component.html',
  styleUrl: './file-resource-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileResourceMetadataComponent {
  readonly resourceType = input<string>('nodes');

  readonly resourceMetadata = select(FilesSelectors.getResourceMetadata);
  readonly contributors = select(FilesSelectors.getContributors);
  readonly isResourceMetadataLoading = select(FilesSelectors.isResourceMetadataLoading);
  readonly isResourceContributorsLoading = select(FilesSelectors.isResourceContributorsLoading);
  readonly isAnonymous = select(FilesSelectors.isFilesAnonymous);
}
