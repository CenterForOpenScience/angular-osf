import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ReviewAction } from '@osf/features/moderation/models';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';

const STATUS = Object({});
STATUS[ReviewsState.Pending] = 'preprints.details.statusBanner.pending';
STATUS[ReviewsState.Accepted] = 'preprints.details.statusBanner.accepted';
STATUS[ReviewsState.Rejected] = 'preprints.details.statusBanner.rejected';
STATUS[ReviewsState.PendingWithdrawal] = 'preprints.details.statusBanner.pendingWithdrawal';
STATUS[ReviewsState.WithdrawalRejected] = 'preprints.details.statusBanner.withdrawalRejected';

const ICONS = Object({});
ICONS[ReviewsState.Pending] = 'hourglass';
ICONS[ReviewsState.Accepted] = 'check-circle';
ICONS[ReviewsState.Rejected] = 'times-circle';
ICONS[ReviewsState.PendingWithdrawal] = 'hourglass';
ICONS[ReviewsState.WithdrawalRejected] = 'times-circle';
ICONS[ReviewsState.Withdrawn] = 'exclamation-triangle';

const MESSAGE = Object({});
MESSAGE[ProviderReviewsWorkflow.PreModeration] = 'preprints.details.statusBanner.messages.pendingPreModeration';
MESSAGE[ProviderReviewsWorkflow.PostModeration] = 'preprints.details.statusBanner.messages.pendingPostModeration';
MESSAGE[ReviewsState.Accepted] = 'preprints.details.statusBanner.messages.accepted';
MESSAGE[ReviewsState.Rejected] = 'preprints.details.statusBanner.messages.rejected';
MESSAGE[ReviewsState.PendingWithdrawal] = 'preprints.details.statusBanner.messages.pendingWithdrawal';
MESSAGE[ReviewsState.WithdrawalRejected] = 'preprints.details.statusBanner.messages.withdrawalRejected';
MESSAGE[ReviewsState.Withdrawn] = 'preprints.details.statusBanner.messages.withdrawn';

const SEVERITIES = Object({});
SEVERITIES[ProviderReviewsWorkflow.PreModeration] = 'warn';
SEVERITIES[ProviderReviewsWorkflow.PostModeration] = 'secondary';
SEVERITIES[ReviewsState.Accepted] = 'success';
SEVERITIES[ReviewsState.Rejected] = 'error';
SEVERITIES[ReviewsState.PendingWithdrawal] = 'error';
SEVERITIES[ReviewsState.WithdrawalRejected] = 'error';
SEVERITIES[ReviewsState.Withdrawn] = 'warn';

@Component({
  selector: 'osf-preprint-status-banner',
  imports: [TranslatePipe, TitleCasePipe, Message, Dialog, Tag, Button],
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

  feedbackDialogVisible = false;

  severity = computed(() => {
    if (this.isPendingWithdrawal()) {
      return SEVERITIES[ReviewsState.PendingWithdrawal];
    } else if (this.isWithdrawn()) {
      return SEVERITIES[ReviewsState.Withdrawn];
    } else if (this.isWithdrawalRejected()) {
      return SEVERITIES[ReviewsState.WithdrawalRejected];
    } else {
      const reviewsState = this.preprint()?.reviewsState;

      return reviewsState === ReviewsState.Pending
        ? SEVERITIES[this.provider()?.reviewsWorkflow || ReviewsState.Withdrawn]
        : SEVERITIES[this.preprint()!.reviewsState];
    }
  });

  status = computed(() => {
    let currentState = this.preprint()!.reviewsState;

    if (this.isPendingWithdrawal()) {
      currentState = ReviewsState.PendingWithdrawal;
    } else if (this.isWithdrawalRejected()) {
      currentState = ReviewsState.WithdrawalRejected;
    }

    return STATUS[currentState];
  });

  iconClass = computed(() => {
    let currentState = this.preprint()!.reviewsState;

    if (this.isPendingWithdrawal()) {
      currentState = ReviewsState.PendingWithdrawal;
    } else if (this.isWithdrawalRejected()) {
      currentState = ReviewsState.WithdrawalRejected;
    }

    return ICONS[currentState];
  });

  reviewerName = computed(() => {
    return this.latestAction()?.creator.name;
  });

  reviewerComment = computed(() => {
    return this.latestAction()?.comment;
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
      return MESSAGE[ReviewsState.PendingWithdrawal];
    } else if (this.isWithdrawalRejected()) {
      return MESSAGE[ReviewsState.WithdrawalRejected];
    } else {
      const reviewsState = this.preprint()?.reviewsState;
      return reviewsState === ReviewsState.Pending
        ? MESSAGE[this.provider()?.reviewsWorkflow || ReviewsState.Withdrawn]
        : MESSAGE[this.preprint()!.reviewsState];
    }
  });
}
