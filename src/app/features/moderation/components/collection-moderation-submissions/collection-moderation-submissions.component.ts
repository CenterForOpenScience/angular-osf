import { TranslatePipe } from '@ngx-translate/core';

import { SelectButton } from 'primeng/selectbutton';

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Primitive } from '@osf/core/helpers';
import { IconComponent, SelectComponent } from '@osf/shared/components';
import { ALL_SORT_OPTIONS } from '@osf/shared/constants';

import { SUBMISSION_REVIEW_OPTIONS } from '../../constants';
import { SubmissionReviewStatus } from '../../enums';
import { SubmissionsListComponent } from '../submissions-list/submissions-list.component';
import { pendingReviews } from '../test-data';

@Component({
  selector: 'osf-collection-moderation-submissions',
  imports: [SelectButton, TranslatePipe, FormsModule, SelectComponent, SubmissionsListComponent, IconComponent],
  templateUrl: './collection-moderation-submissions.component.html',
  styleUrl: './collection-moderation-submissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionModerationSubmissionsComponent {
  readonly submissionReviewOptions = SUBMISSION_REVIEW_OPTIONS;

  sortOptions = ALL_SORT_OPTIONS;
  selectedSortOption = signal(null);
  selectedReviewOption = this.submissionReviewOptions[0].value;

  totalCount = 5;

  submissions = pendingReviews;

  changeReviewStatus(value: SubmissionReviewStatus) {
    console.log(value);
  }

  changeSort(value: Primitive) {
    console.log(value);
  }
}
