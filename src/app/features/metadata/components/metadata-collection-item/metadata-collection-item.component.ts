import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { collectionFilterNames } from '@osf/features/collections/constants';
import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import { CollectionSubmission } from '@osf/shared/models/collections/collections.models';

@Component({
  selector: 'osf-metadata-collection-item',
  imports: [TranslatePipe, Tag, Button, RouterLink],
  templateUrl: './metadata-collection-item.component.html',
  styleUrl: './metadata-collection-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataCollectionItemComponent {
  readonly CollectionSubmissionReviewState = CollectionSubmissionReviewState;

  submission = input.required<CollectionSubmission>();

  showSubmissionButton = computed(() => this.submission().reviewsState === CollectionSubmissionReviewState.Accepted);

  submissionButtonLabel = computed(() => {
    const status = this.submission().status;
    return status === CollectionSubmissionReviewState.Removed ? 'common.buttons.resubmit' : 'common.buttons.edit';
  });

  showAttributes = computed(
    () => this.submission().reviewsState !== CollectionSubmissionReviewState.Removed && !!this.attributes().length
  );

  attributes = computed(() => {
    const submission = this.submission();
    const attributes: { key: string; label: string; value: string }[] = [];

    for (const filter of collectionFilterNames) {
      const value = submission[filter.key as keyof CollectionSubmission];

      if (value) {
        attributes.push({
          key: filter.key,
          label: filter.label,
          value: String(value),
        });
      }
    }

    return attributes;
  });
}
