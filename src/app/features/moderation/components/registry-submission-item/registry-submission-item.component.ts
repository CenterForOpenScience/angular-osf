import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { DateAgoPipe } from '@osf/shared/pipes/date-ago.pipe';

import { REGISTRY_ACTION_LABEL, ReviewStatusIcon } from '../../constants';
import { ActionStatus, SubmissionReviewStatus } from '../../enums';
import { RegistryModeration } from '../../models';

@Component({
  selector: 'osf-registry-submission-item',
  imports: [IconComponent, DateAgoPipe, Button, TranslatePipe, DatePipe, TruncatedTextComponent],
  templateUrl: './registry-submission-item.component.html',
  styleUrl: './registry-submission-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrySubmissionItemComponent {
  status = input.required<SubmissionReviewStatus>();
  submission = input.required<RegistryModeration>();

  selected = output<void>();

  readonly reviewStatusIcon = ReviewStatusIcon;
  readonly registryActionLabel = REGISTRY_ACTION_LABEL;
  readonly registryActionState = ActionStatus;

  limitValue = 1;
  showAll = false;

  get isRejected(): boolean {
    return this.status() === SubmissionReviewStatus.Rejected;
  }

  toggleHistory() {
    this.showAll = !this.showAll;
  }
}
