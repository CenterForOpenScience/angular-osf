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
import { IconComponent } from '@shared/components';

@Component({
  selector: 'osf-preprint-status-banner',
  imports: [TranslatePipe, TitleCasePipe, Message, Dialog, Tag, Button, IconComponent],
  templateUrl: './status-banner.component.html',
  styleUrl: './status-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBannerComponent {
  private readonly translateService = inject(TranslateService);
  provider = input.required<PreprintProviderDetails>();
  preprint = select(PreprintSelectors.getPreprint);

  latestAction = input.required<ReviewAction | null>();
  isPendingWithdrawal = input.required<boolean>();
  isWithdrawalRejected = input.required<boolean>();
  latestRequestAction = input.required<PreprintRequestAction | null>();

  feedbackDialogVisible = false;

  severity = computed(() => {
    if (this.isPendingWithdrawal()) {
      return statusSeverityByState[ReviewsState.PendingWithdrawal]!;
    } else if (this.isWithdrawn()) {
      return statusSeverityByState[ReviewsState.Withdrawn]!;
    } else if (this.isWithdrawalRejected()) {
      return statusSeverityByState[ReviewsState.WithdrawalRejected]!;
    } else {
      const reviewsState = this.preprint()?.reviewsState;

      return reviewsState === ReviewsState.Pending
        ? statusSeverityByWorkflow[this.provider()?.reviewsWorkflow as ProviderReviewsWorkflow]
        : statusSeverityByState[this.preprint()!.reviewsState]!;
    }
  });

  status = computed(() => {
    let currentState = this.preprint()!.reviewsState;

    if (this.isPendingWithdrawal()) {
      currentState = ReviewsState.PendingWithdrawal;
    } else if (this.isWithdrawalRejected()) {
      currentState = ReviewsState.WithdrawalRejected;
    }

    return statusLabelKeyByState[currentState]!;
  });

  iconClass = computed(() => {
    let currentState = this.preprint()!.reviewsState;

    if (this.isPendingWithdrawal()) {
      currentState = ReviewsState.PendingWithdrawal;
    } else if (this.isWithdrawalRejected()) {
      currentState = ReviewsState.WithdrawalRejected;
    }

    return statusIconByState[currentState];
  });

  reviewerName = computed(() => {
    if (this.isWithdrawalRejected()) {
      return this.latestRequestAction()?.creator.name;
    } else {
      return this.latestAction()?.creator.name;
    }
  });

  reviewerComment = computed(() => {
    if (this.isWithdrawalRejected()) {
      return this.latestRequestAction()?.comment;
    } else {
      return this.latestAction()?.comment;
    }
  });

  isWithdrawn = computed(() => {
    return this.preprint()?.dateWithdrawn !== null;
  });

  bannerContent = computed(() => {
    const documentType = this.provider().preprintWord;
    if (this.isPendingWithdrawal() || this.isWithdrawn() || this.isWithdrawalRejected()) {
      return this.translateService.instant(this.statusExplanation(), {
        documentType,
      });
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
    if (this.isPendingWithdrawal()) {
      return statusMessageByState[ReviewsState.PendingWithdrawal]!;
    } else if (this.isWithdrawalRejected()) {
      return statusMessageByState[ReviewsState.WithdrawalRejected]!;
    } else {
      const reviewsState = this.preprint()?.reviewsState;
      return reviewsState === ReviewsState.Pending
        ? statusMessageByWorkflow[this.provider()?.reviewsWorkflow as ProviderReviewsWorkflow]
        : statusMessageByState[this.preprint()!.reviewsState]!;
    }
  });

  showFeedbackDialog() {
    this.feedbackDialogVisible = true;
  }
}
