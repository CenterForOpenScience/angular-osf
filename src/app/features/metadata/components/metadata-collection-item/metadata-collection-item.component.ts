import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { collectionFilterNames } from '@osf/features/collections/constants';
import { CEDAR_VIEWER_CONFIG } from '@osf/features/metadata/constants';
import { CedarMetadataDataTemplateJsonApi, CedarMetadataRecordData } from '@osf/features/metadata/models';
import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import { CollectionSubmission } from '@osf/shared/models/collections/collections.model';
import { KeyValueModel } from '@osf/shared/models/common/key-value.model';
import { CollectionStatusSeverityPipe } from '@osf/shared/pipes/collection-status-severity.pipe';

@Component({
  selector: 'osf-metadata-collection-item',
  imports: [TranslatePipe, Tag, Button, RouterLink, CollectionStatusSeverityPipe],
  templateUrl: './metadata-collection-item.component.html',
  styleUrl: './metadata-collection-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})
export class MetadataCollectionItemComponent {
  readonly CollectionSubmissionReviewState = CollectionSubmissionReviewState;

  submission = input.required<CollectionSubmission>();
  isCedarMode = input<boolean>(false);
  cedarRecord = input<CedarMetadataRecordData | null>(null);
  cedarTemplate = input<CedarMetadataDataTemplateJsonApi | null>(null);

  cedarViewerConfig = CEDAR_VIEWER_CONFIG;

  showSubmissionButton = computed(() => this.submission().reviewsState === CollectionSubmissionReviewState.Accepted);

  submissionButtonLabel = computed(() => {
    const status = this.submission().status;
    return status === CollectionSubmissionReviewState.Removed ? 'common.buttons.resubmit' : 'common.buttons.edit';
  });

  showAttributes = computed(
    () =>
      !this.isCedarMode() &&
      this.submission().reviewsState !== CollectionSubmissionReviewState.Removed &&
      !!this.attributes().length
  );

  showCedarViewer = computed(
    () =>
      this.isCedarMode() &&
      !!this.cedarRecord() &&
      !!this.cedarTemplate()?.attributes?.template &&
      this.submission().reviewsState !== CollectionSubmissionReviewState.Removed
  );

  cedarMetadata = computed(() => {
    const record = this.cedarRecord();
    return record?.attributes?.metadata ? (record.attributes.metadata as Record<string, unknown>) : {};
  });

  attributes = computed(() => {
    const submission = this.submission();
    const attributes: KeyValueModel[] = [];

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
