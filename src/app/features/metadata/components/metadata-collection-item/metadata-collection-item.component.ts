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

import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import { CollectionSubmission } from '@osf/shared/models/collections/collection-submissions.model';
import { CollectionStatusSeverityPipe } from '@osf/shared/pipes/collection-status-severity.pipe';

import { CEDAR_VIEWER_CONFIG } from '../../constants';
import { CedarMetadataDataTemplateJsonApi, CedarMetadataRecordDataJsonApi } from '../../models';

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
  cedarRecord = input<CedarMetadataRecordDataJsonApi | null>(null);
  cedarTemplate = input<CedarMetadataDataTemplateJsonApi | null>(null);

  cedarViewerConfig = CEDAR_VIEWER_CONFIG;

  showSubmissionButton = computed(() => this.submission().reviewsState === CollectionSubmissionReviewState.Accepted);

  submissionButtonLabel = computed(() =>
    this.submission().reviewsState === CollectionSubmissionReviewState.Removed
      ? 'common.buttons.resubmit'
      : 'common.buttons.edit'
  );

  showCedarViewer = computed(
    () =>
      !!this.cedarRecord() &&
      !!this.cedarTemplate()?.attributes?.template &&
      this.submission().reviewsState !== CollectionSubmissionReviewState.Removed
  );

  cedarMetadata = computed(() => {
    const record = this.cedarRecord();
    return record?.attributes?.metadata ? (record.attributes.metadata as Record<string, unknown>) : {};
  });
}
