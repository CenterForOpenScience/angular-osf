import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { StopPropagationDirective } from '@osf/shared/directives/stop-propagation.directive';
import { DateAgoPipe } from '@osf/shared/pipes/date-ago.pipe';

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
  loadMoreContributors = output<void>();

  readonly reviewStatusIcon = ReviewStatusIcon;
  readonly actionLabel = PREPRINT_ACTION_LABEL;
  readonly actionState = ActionStatus;

  limitValue = 1;
  showAll = false;

  hasMoreContributors = computed(() => {
    const submission = this.submission();
    return submission.contributors.length < submission.totalContributors;
  });

  toggleHistory() {
    this.showAll = !this.showAll;
  }

  handleOpen() {
    this.loadContributors.emit();
  }
}
