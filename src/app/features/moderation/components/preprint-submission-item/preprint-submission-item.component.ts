import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { PREPRINT_ACTION_LABEL, ReviewStatusIcon } from '@osf/features/moderation/constants';
import { ActionStatus, SubmissionReviewStatus } from '@osf/features/moderation/enums';
import { IconComponent } from '@osf/shared/components';
import { DateAgoPipe } from '@osf/shared/pipes';

import { PreprintSubmission, PreprintWithdrawalSubmission } from '../../models';

@Component({
  selector: 'osf-preprint-submission-item',
  imports: [IconComponent, DateAgoPipe, Button, TranslatePipe],
  templateUrl: './preprint-submission-item.component.html',
  styleUrl: './preprint-submission-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintSubmissionItemComponent {
  status = input.required<SubmissionReviewStatus>();
  submission = input.required<PreprintSubmission | PreprintWithdrawalSubmission>();
  selected = output<void>();

  readonly reviewStatusIcon = ReviewStatusIcon;
  readonly actionLabel = PREPRINT_ACTION_LABEL;
  readonly actionState = ActionStatus;

  limitValue = 1;
  showAll = false;

  toggleHistory() {
    this.showAll = !this.showAll;
  }
}
