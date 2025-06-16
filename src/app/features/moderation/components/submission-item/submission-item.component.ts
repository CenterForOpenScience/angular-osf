import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconComponent } from '@osf/shared/components';

import { ReviewStatusIcon } from '../../constants';
import { SubmissionReviewStatus } from '../../enums';
import { Submission } from '../../models';

@Component({
  selector: 'osf-submission-item',
  imports: [TranslatePipe, IconComponent],
  templateUrl: './submission-item.component.html',
  styleUrl: './submission-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionItemComponent {
  submission = input.required<Submission>();

  readonly reviewStatusIcon = ReviewStatusIcon;
  readonly selectedIcon = SubmissionReviewStatus.Pending;
}
