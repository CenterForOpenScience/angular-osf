import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  GetCollectionSubmissionContributors,
  LoadMoreCollectionSubmissionContributors,
} from '@osf/features/moderation/store/collections-moderation';
import { CollectionSubmissionWithGuid } from '@shared/models/collections/collections.models';

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

  readonly actions = createDispatchMap({
    getCollectionSubmissionContributors: GetCollectionSubmissionContributors,
    loadMoreCollectionSubmissionContributors: LoadMoreCollectionSubmissionContributors,
  });

  loadContributors(item: CollectionSubmissionWithGuid) {
    this.actions.getCollectionSubmissionContributors(item.id, 1);
  }

  loadMoreContributors(item: CollectionSubmissionWithGuid) {
    this.actions.loadMoreCollectionSubmissionContributors(item.id);
  }
}
