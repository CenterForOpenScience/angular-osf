import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ReviewAction } from '@osf/features/moderation/models';
import {
  statusIconByState,
  statusLabelKeyByState,
  statusMessageByState,
  statusMessageByWorkflow,
  statusSeverityByState,
  statusSeverityByWorkflow,
} from '@osf/features/preprints/constants';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { PreprintProviderDetails, PreprintRequestAction } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { IconComponent } from '@osf/shared/components/icon/icon.component';

@Component({
  selector: 'osf-preprint-status-banner',
  imports: [Button, Dialog, Message, Tag, IconComponent, TitleCasePipe, TranslatePipe],
  templateUrl: './status-banner.component.html',
  styleUrl: './status-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBannerComponent {
  private readonly translateService = inject(TranslateService);

  readonly provider = input.required<PreprintProviderDetails>();

  readonly latestAction = input.required<ReviewAction | null>();
  readonly isPendingWithdrawal = input.required<boolean>();
  readonly isWithdrawalRejected = input.required<boolean>();
  readonly latestRequestAction = input.required<PreprintRequestAction | null>();

  readonly preprint = select(PreprintSelectors.getPreprint);

  feedbackDialogVisible = false;

  currentState = computed(() => {
    if (this.isPendingWithdrawal()) {
      return ReviewsState.PendingWithdrawal;
    }

    if (this.isWithdrawalRejected()) {
      return ReviewsState.WithdrawalRejected;
    }

    return this.preprint()?.reviewsState ?? ReviewsState.Pending;
  });

  severity = computed(() => {
    const currentState = this.currentState();
    const workflow = this.provider()?.reviewsWorkflow;

    if (this.isWithdrawn()) {
      return statusSeverityByState[ReviewsState.Withdrawn];
    }

    if (currentState === ReviewsState.Pending && workflow) {
      return statusSeverityByWorkflow[workflow];
    }

    return statusSeverityByState[currentState];
  });

  status = computed(() => statusLabelKeyByState[this.currentState()]!);
  iconClass = computed(() => statusIconByState[this.currentState()]);

  reviewerName = computed(() => {
    const action = this.isWithdrawalRejected() ? this.latestRequestAction() : this.latestAction();
    return action?.creator?.name ?? '';
  });

  reviewerComment = computed(() => {
    const action = this.isWithdrawalRejected() ? this.latestRequestAction() : this.latestAction();
    return action?.comment ?? '';
  });

  isWithdrawn = computed(() => Boolean(this.preprint()?.dateWithdrawn));

  bannerContent = computed(() => {
    const documentType = this.provider().preprintWord;
    if (this.isPendingWithdrawal() || this.isWithdrawn() || this.isWithdrawalRejected()) {
      return this.translateService.instant(this.statusExplanation(), { documentType });
    } else {
      const name = this.provider()!.name;
      const workflow = this.provider()?.reviewsWorkflow;
      const statusExplanation = this.translateService.instant(this.statusExplanation());
      const baseMessage = this.translateService.instant('preprints.details.statusBanner.messages.base', {
        name,
        workflow,
        documentType,
      });

      return `${baseMessage} ${statusExplanation}`;
    }
  });

  private statusExplanation = computed(() => {
    const currentState = this.currentState();
    return currentState === ReviewsState.Pending
      ? statusMessageByWorkflow[this.provider()?.reviewsWorkflow as ProviderReviewsWorkflow]
      : statusMessageByState[currentState]!;
  });

  showFeedbackDialog() {
    this.feedbackDialogVisible = true;
  }
}
