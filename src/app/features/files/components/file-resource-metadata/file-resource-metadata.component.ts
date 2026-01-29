import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

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
  private readonly viewOnlyService = inject(ViewOnlyLinkHelperService);

  resourceType = input<string>('nodes');
  resourceMetadata = select(FilesSelectors.getResourceMetadata);
  contributors = select(FilesSelectors.getContributors);
  isResourceMetadataLoading = select(FilesSelectors.isResourceMetadataLoading);
  isResourceContributorsLoading = select(FilesSelectors.isResourceContributorsLoading);
  hasViewOnly = computed(() => this.viewOnlyService.hasViewOnlyParam(this.router));
}
