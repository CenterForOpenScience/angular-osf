import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconComponent } from '@osf/shared/components';
import { DateAgoPipe } from '@osf/shared/pipes';

import { REGISTRY_ACTION_LABEL, ReviewStatusIcon } from '../../constants';
import { ActionStatus, SubmissionReviewStatus } from '../../enums';
import { RegistryModeration } from '../../models';

@Component({
  selector: 'osf-registry-submission-item',
  imports: [IconComponent, DateAgoPipe, Button, TranslatePipe, RouterLink],
  templateUrl: './registry-submission-item.component.html',
  styleUrl: './registry-submission-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrySubmissionItemComponent {
  status = input.required<SubmissionReviewStatus>();
  submission = input.required<RegistryModeration>();

  readonly reviewStatusIcon = ReviewStatusIcon;
  readonly registryActionLabel = REGISTRY_ACTION_LABEL;
  readonly registryActionState = ActionStatus;

  limitValue = 1;
  showAll = false;

  toggleHistory() {
    this.showAll = !this.showAll;
  }
}
