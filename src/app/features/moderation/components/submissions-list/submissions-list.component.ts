import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CollectionsModerationSelectors } from '@osf/features/moderation/store/collections-moderation';

import { SubmissionItemComponent } from '../submission-item/submission-item.component';

@Component({
  selector: 'osf-submissions-list',
  imports: [SubmissionItemComponent, TranslatePipe],
  templateUrl: './submissions-list.component.html',
  styleUrl: './submissions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionsListComponent {
  submissions = select(CollectionsModerationSelectors.getCollectionSubmissions);
}
