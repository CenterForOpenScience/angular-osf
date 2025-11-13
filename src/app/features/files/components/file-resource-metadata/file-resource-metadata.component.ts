import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { hasViewOnlyParam } from '@osf/shared/helpers/view-only.helper';

import { FilesSelectors } from '../../store';

@Component({
  selector: 'osf-file-resource-metadata',
  imports: [DatePipe, TranslatePipe, Skeleton, ContributorsListComponent],
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
