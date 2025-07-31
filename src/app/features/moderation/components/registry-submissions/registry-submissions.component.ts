import { TranslatePipe } from '@ngx-translate/core';

import { SelectButton } from 'primeng/selectbutton';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Primitive } from '@osf/core/helpers';
import { CollectionSubmissionsListComponent } from '@osf/features/moderation/components/collection-submissions-list/collection-submissions-list.component';
import { IconComponent, SelectComponent } from '@osf/shared/components';
import { ALL_SORT_OPTIONS } from '@osf/shared/constants';

import { SUBMITTED_SUBMISSION_REVIEW_OPTIONS } from '../../constants';
import { SubmissionReviewStatus } from '../../enums';
import { pubicReviews } from '../test-data';

@Component({
  selector: 'osf-registry-submissions',
  imports: [
    SelectButton,
    TranslatePipe,
    FormsModule,
    SelectComponent,
    CollectionSubmissionsListComponent,
    IconComponent,
    TitleCasePipe,
  ],
  templateUrl: './registry-submissions.component.html',
  styleUrl: './registry-submissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrySubmissionsComponent {
  readonly submissionReviewOptions = SUBMITTED_SUBMISSION_REVIEW_OPTIONS;

  sortOptions = ALL_SORT_OPTIONS;
  selectedSortOption = signal(null);
  selectedReviewOption = this.submissionReviewOptions[0].value;

  totalCount = 5;

  submissions = pubicReviews;

  changeReviewStatus(value: SubmissionReviewStatus) {
    console.log(value);
  }

  changeSort(value: Primitive) {
    console.log(value);
  }
}
