import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ResourceModel } from '@osf/shared/models/search/resource.model';
import { UserRelatedCounts } from '@osf/shared/models/user-related-counts/user-related-counts.model';

@Component({
  selector: 'osf-user-secondary-metadata',
  imports: [TranslatePipe, Skeleton],
  templateUrl: './user-secondary-metadata.component.html',
  styleUrl: './user-secondary-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSecondaryMetadataComponent {
  resource = input.required<ResourceModel>();
  isDataLoading = input<boolean>(true);
  userRelatedCounts = input<UserRelatedCounts | null>(null);
}
