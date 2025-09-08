import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ResourceModel, UserRelatedCounts } from '@shared/models';

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
