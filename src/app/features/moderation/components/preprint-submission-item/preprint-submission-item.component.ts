import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ContributorsListComponent, IconComponent, TruncatedTextComponent } from '@osf/shared/components';
import { StopPropagationDirective } from '@osf/shared/directives';
import { DateAgoPipe } from '@osf/shared/pipes';

import { PREPRINT_ACTION_LABEL, ReviewStatusIcon } from '../../constants';
import { ActionStatus, SubmissionReviewStatus } from '../../enums';
import { PreprintSubmissionModel, PreprintWithdrawalSubmission } from '../../models';

@Component({
  selector: 'osf-preprint-submission-item',
  imports: [
    IconComponent,
    DateAgoPipe,
    Button,
    TranslatePipe,
    TruncatedTextComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    ContributorsListComponent,
    Skeleton,
    StopPropagationDirective,
  ],
  templateUrl: './preprint-submission-item.component.html',
  styleUrl: './preprint-submission-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintSubmissionItemComponent {
  status = input.required<SubmissionReviewStatus>();
  submission = input.required<PreprintSubmissionModel | PreprintWithdrawalSubmission>();
  selected = output<void>();
  loadContributors = output<void>();

  readonly reviewStatusIcon = ReviewStatusIcon;
  readonly actionLabel = PREPRINT_ACTION_LABEL;
  readonly actionState = ActionStatus;

  limitValue = 1;
  showAll = false;

  toggleHistory() {
    this.showAll = !this.showAll;
  }

  handleOpen() {
    this.loadContributors.emit();
  }
}
