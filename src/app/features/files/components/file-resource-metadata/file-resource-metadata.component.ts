import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { hasViewOnlyParam } from '@osf/shared/helpers';

import { FilesSelectors } from '../../store';

@Component({
  selector: 'osf-file-resource-metadata',
  imports: [DatePipe, TranslatePipe, Skeleton, RouterLink],
  templateUrl: './file-resource-metadata.component.html',
  styleUrl: './file-resource-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileResourceMetadataComponent {
  private readonly router = inject(Router);

  resourceType = input<string>('nodes');
  resourceMetadata = select(FilesSelectors.getResourceMetadata);
  contributors = select(FilesSelectors.getContributors);
  isResourceMetadataLoading = select(FilesSelectors.isResourceMetadataLoading);
  isResourceContributorsLoading = select(FilesSelectors.isResourceContributorsLoading);
  hasViewOnly = computed(() => hasViewOnlyParam(this.router));
}
