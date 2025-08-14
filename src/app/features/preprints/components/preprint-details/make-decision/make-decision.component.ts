import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Tooltip } from 'primeng/tooltip';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';

import { ReviewAction } from '@osf/features/moderation/models';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { PreprintProviderDetails, PreprintRequest } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';

const SETTINGS = {
  comments: {
    public: 'preprints.details.decision.settings.comments.public',
    private: 'preprints.details.decision.settings.comments.private',
  },
  names: {
    anonymous: 'preprints.details.decision.settings.names.anonymous',
    named: 'preprints.details.decision.settings.names.named',
  },
  moderation: {
    [ProviderReviewsWorkflow.PreModeration]: 'preprints.details.decision.settings.moderation.pre',
    [ProviderReviewsWorkflow.PostModeration]: 'preprints.details.decision.settings.moderation.post',
  },
};

@Component({
  selector: 'osf-make-decision',
  imports: [Button, TranslatePipe, TitleCasePipe, Dialog, Tooltip],
  templateUrl: './make-decision.component.html',
  styleUrl: './make-decision.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakeDecisionComponent {
  preprint = select(PreprintSelectors.getPreprint);
  provider = input.required<PreprintProviderDetails>();
  latestAction = input.required<ReviewAction | null>();
  latestWithdrawalRequest = input.required<PreprintRequest | null>();

  isPendingWithdrawal = input.required<boolean>();

  dialogVisible = false;
  decision = signal<ReviewsState>(ReviewsState.Accepted);
  initialReviewerComment = signal<string | null>(null);
  reviewerComment = signal<string | null>(null);

  protected readonly ReviewsState = ReviewsState;

  labelDecisionButton = computed(() => {
    const preprint = this.preprint()!;
    if (preprint.reviewsState === ReviewsState.Withdrawn) {
      return 'preprints.details.decision.withdrawalReason';
    } else if (this.isPendingWithdrawal()) {
      return 'preprints.details.decision.makeDecision';
    } else {
      return preprint.reviewsState === ReviewsState.Pending
        ? 'preprints.details.decision.makeDecision'
        : 'preprints.details.decision.modifyDecision';
    }
  });

  labelDecisionDialogHeader = computed(() => {
    const preprint = this.preprint()!;

    if (preprint.reviewsState === ReviewsState.Withdrawn) {
      return 'preprints.details.decision.header.withdrawalReason';
    } else if (this.isPendingWithdrawal()) {
      return 'preprints.details.decision.header.submitDecision';
    } else {
      return preprint.reviewsState === ReviewsState.Pending
        ? 'preprints.details.decision.header.submitDecision'
        : 'preprints.details.decision.header.modifyDecision';
    }
  });

  labelSubmitButton = computed(() => {
    if (this.isPendingWithdrawal()) {
      return 'preprints.details.decision.submitButton.submitDecision';
    } else if (this.preprint()?.reviewsState === ReviewsState.Pending) {
      return 'preprints.details.decision.submitButton.submitDecision';
    } else if (this.preprint()?.reviewsState !== this.decision()) {
      return 'preprints.details.decision.submitButton.modifyDecision';
    } else if (this.reviewerComment() !== this.initialReviewerComment()) {
      return 'preprints.details.decision.submitButton.update_comment';
    }
    return 'preprints.details.decision.submitButton.modifyDecision';
  });

  submitButtonDisabled = computed(() => {
    //TODO implement this logic
    //return this.get('saving') || (!this.get('decisionChanged') && !this.get('commentEdited')) || this.get('commentExceedsLimit');
    return false;
  });

  makeDecisionButtonDisabled = computed(() => {
    const reason = this.latestAction()?.comment;
    const state = this.preprint()?.reviewsState;
    return state === ReviewsState.Withdrawn && !reason;
  });

  settingsComments = computed(() => {
    const commentType = this.provider().reviewsCommentsPrivate ? 'private' : 'public';
    return SETTINGS.comments[commentType];
  });

  settingsNames = computed(() => {
    const commentType = this.provider().reviewsCommentsAnonymous ? 'anonymous' : 'named';
    return SETTINGS.names[commentType];
  });

  settingsModeration = computed(() => {
    return SETTINGS.moderation[this.provider().reviewsWorkflow || ProviderReviewsWorkflow.PreModeration];
  });

  constructor() {
    effect(() => {
      const preprint = this.preprint();
      const latestAction = this.latestAction();
      if (preprint && latestAction) {
        this.decision.set(preprint.reviewsState);
        this.initialReviewerComment.set(latestAction?.comment);
        this.reviewerComment.set(latestAction?.comment);
      }
    });
  }

  submit() {
    //TODO implement this logic
  }
}
