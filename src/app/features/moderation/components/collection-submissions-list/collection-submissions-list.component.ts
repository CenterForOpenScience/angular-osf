import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CollectionsModerationSelectors } from '../../store/collections-moderation';
import { CollectionSubmissionItemComponent } from '../collection-submission-item/collection-submission-item.component';

@Component({
  selector: 'osf-submissions-list',
  imports: [CollectionSubmissionItemComponent, TranslatePipe],
  templateUrl: './collection-submissions-list.component.html',
  styleUrl: './collection-submissions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionSubmissionsListComponent {
  submissions = select(CollectionsModerationSelectors.getCollectionSubmissions);
}
