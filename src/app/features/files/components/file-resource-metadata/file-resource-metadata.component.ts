import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FilesSelectors } from '../../store';

@Component({
  selector: 'osf-file-resource-metadata',
  imports: [DatePipe, TranslatePipe, Skeleton],
  templateUrl: './file-resource-metadata.component.html',
  styleUrl: './file-resource-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileResourceMetadataComponent {
  resourceType = input<string>('nodes');
  resourceMetadata = select(FilesSelectors.getResourceMetadata);
  contributors = select(FilesSelectors.getContributors);
  isResourceMetadataLoading = select(FilesSelectors.isResourceMetadataLoading);
  isResourceContributorsLoading = select(FilesSelectors.isResourceContributorsLoading);
}
