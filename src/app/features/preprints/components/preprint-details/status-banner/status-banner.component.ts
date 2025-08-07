import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ReviewAction } from '@osf/features/moderation/models';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';

const STATUS = Object({});
STATUS[ReviewsState.Pending] = 'Pending';
STATUS[ReviewsState.Accepted] = 'Accepted';
STATUS[ReviewsState.Rejected] = 'Rejected';
STATUS[ReviewsState.PendingWithdrawal] = 'Pending withdrawal';
STATUS[ReviewsState.WithdrawalRejected] = 'Withdrawal rejected';

const ICONS = Object({});
ICONS[ReviewsState.Pending] = 'hourglass';
ICONS[ReviewsState.Accepted] = 'check-circle';
ICONS[ReviewsState.Rejected] = 'times-circle';
ICONS[ReviewsState.PendingWithdrawal] = 'hourglass';
ICONS[ReviewsState.WithdrawalRejected] = 'times-circle';
ICONS[ReviewsState.Withdrawn] = 'exclamation-triangle';

const MESSAGE = Object({});
MESSAGE[ProviderReviewsWorkflow.PreModeration] =
  'is not publicly available or searchable until approved by a moderator.';
MESSAGE[ProviderReviewsWorkflow.PostModeration] =
  'is publicly available and searchable but is subject to removal by a moderator.';
MESSAGE[ReviewsState.Accepted] = 'has been accepted by a moderator and is publicly available and searchable.';
MESSAGE[ReviewsState.Rejected] = 'has been rejected by a moderator and is not publicly available or searchable.';
MESSAGE[ReviewsState.PendingWithdrawal] =
  'This {documentType} has been requested by the authors to be withdrawn. It will still be publicly searchable until the request has been approved.';
MESSAGE[ReviewsState.WithdrawalRejected] =
  'Your request to withdraw this {documentType} from the service has been denied by the moderator.';
MESSAGE[ReviewsState.Withdrawn] = 'This {documentType} has been withdrawn.';

const SEVERITIES = Object({});
SEVERITIES[ProviderReviewsWorkflow.PreModeration] = 'warn';
SEVERITIES[ProviderReviewsWorkflow.PostModeration] = 'secondary';
SEVERITIES[ReviewsState.Accepted] = 'success';
SEVERITIES[ReviewsState.Rejected] = 'error';
SEVERITIES[ReviewsState.PendingWithdrawal] = 'error';
SEVERITIES[ReviewsState.WithdrawalRejected] = 'error';
SEVERITIES[ReviewsState.Withdrawn] = 'warn';

//1. pending status for pre- and post-moderation providers | works
//2. accepted status for pre- and post-moderation providers | works
//3. rejected status for pre-moderation | works
//4. withdrawn status for post-moderation | works

//[RNi] TODO: check pending withdrawal and withdrawal rejected status for pre- and post-moderation providers

@Component({
  selector: 'osf-preprint-status-banner',
  imports: [TranslatePipe, TitleCasePipe, Message, Dialog, Tag, Button],
  templateUrl: './status-banner.component.html',
  styleUrl: './status-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBannerComponent {
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
    if (this.isPendingWithdrawal()) {
      return this.statusExplanation();
    } else if (this.isWithdrawn()) {
      return this.statusExplanation();
    } else if (this.isWithdrawalRejected()) {
      return this.statusExplanation();
    } else {
      const name = this.provider()!.name;
      const workflow = this.provider()?.reviewsWorkflow;
      const statusExplanation = this.statusExplanation();

      return `${name} uses ${workflow}. This preprint ${statusExplanation}`;
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
