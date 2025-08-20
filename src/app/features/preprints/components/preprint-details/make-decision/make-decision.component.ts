import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Message } from 'primeng/message';
import { RadioButton } from 'primeng/radiobutton';
import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ReviewAction } from '@osf/features/moderation/models';
import { decisionExplanation, decisionSettings, formInputLimits } from '@osf/features/preprints/constants';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { PreprintProviderDetails, PreprintRequest } from '@osf/features/preprints/models';
import {
  PreprintSelectors,
  SubmitRequestsDecision,
  SubmitReviewsDecision,
} from '@osf/features/preprints/store/preprint';
import { StringOrNull } from '@shared/helpers';

@Component({
  selector: 'osf-make-decision',
  imports: [Button, TranslatePipe, TitleCasePipe, Dialog, Tooltip, RadioButton, FormsModule, Textarea, Message],
  templateUrl: './make-decision.component.html',
  styleUrl: './make-decision.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakeDecisionComponent {
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly actions = createDispatchMap({
    submitReviewsDecision: SubmitReviewsDecision,
    submitRequestsDecision: SubmitRequestsDecision,
  });

  protected readonly ReviewsState = ReviewsState;

  preprint = select(PreprintSelectors.getPreprint);
  provider = input.required<PreprintProviderDetails>();
  latestAction = input.required<ReviewAction | null>();
  latestWithdrawalRequest = input.required<PreprintRequest | null>();
  isPendingWithdrawal = input.required<boolean>();

  dialogVisible = false;
  didValidate = signal<boolean>(false);
  decision = signal<ReviewsState>(ReviewsState.Accepted);
  initialReviewerComment = signal<StringOrNull>(null);
  reviewerComment = signal<StringOrNull>(null);
  requestDecisionJustification = signal<StringOrNull>(null);
  saving = signal<boolean>(false);

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

  makeDecisionButtonDisabled = computed(() => {
    const reason = this.latestAction()?.comment;
    const state = this.preprint()?.reviewsState;
    return state === ReviewsState.Withdrawn && !reason;
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
    } else if (this.decisionChanged()) {
      return 'preprints.details.decision.submitButton.modifyDecision';
    } else if (this.commentEdited()) {
      return 'preprints.details.decision.submitButton.updateComment';
    }
    return 'preprints.details.decision.submitButton.modifyDecision';
  });

  submitButtonDisabled = computed(() => {
    return (!this.decisionChanged() && !this.commentEdited()) || this.commentExceedsLimit();
  });

  acceptOptionExplanation = computed(() => {
    const reviewsWorkflow = this.provider().reviewsWorkflow;
    if (reviewsWorkflow === ProviderReviewsWorkflow.PreModeration) {
      return 'preprints.details.decision.accept.pre';
    } else if (reviewsWorkflow === ProviderReviewsWorkflow.PostModeration) {
      return 'preprints.details.decision.accept.post';
    }

    return 'preprints.details.decision.accept.pre';
  });

  rejectOptionLabel = computed(() => {
    return this.preprint()?.isPublished
      ? 'preprints.details.decision.withdrawn.label'
      : 'preprints.details.decision.reject.label';
  });

  labelRequestDecisionJustification = computed(() => {
    if (this.decision() === ReviewsState.Accepted) {
      return 'preprints.details.decision.withdrawalJustification';
    } else if (this.decision() === ReviewsState.Rejected) {
      return 'preprints.details.decision.denialJustification';
    }

    return 'preprints.details.decision.withdrawalJustification';
  });

  rejectOptionExplanation = computed(() => {
    const reviewsWorkflow = this.provider().reviewsWorkflow;
    if (reviewsWorkflow === ProviderReviewsWorkflow.PreModeration) {
      if (this.preprint()?.reviewsState === ReviewsState.Accepted) {
        return 'preprints.details.decision.approve.explanation';
      } else {
        return decisionExplanation.reject[reviewsWorkflow];
      }
    } else {
      return decisionExplanation.withdrawn[reviewsWorkflow!];
    }
  });

  rejectRadioButtonValue = computed(() => {
    return this.preprint()?.isPublished ? ReviewsState.Withdrawn : ReviewsState.Rejected;
  });

  settingsComments = computed(() => {
    const commentType = this.provider().reviewsCommentsPrivate ? 'private' : 'public';
    return decisionSettings.comments[commentType];
  });

  settingsNames = computed(() => {
    const commentType = this.provider().reviewsCommentsAnonymous ? 'anonymous' : 'named';
    return decisionSettings.names[commentType];
  });

  settingsModeration = computed(() => {
    return decisionSettings.moderation[this.provider().reviewsWorkflow || ProviderReviewsWorkflow.PreModeration];
  });

  commentEdited = computed(() => {
    return this.reviewerComment()?.trim() !== this.initialReviewerComment();
  });

  commentExceedsLimit = computed(() => {
    const comment = this.reviewerComment();
    if (!comment) return false;

    return comment.length > formInputLimits.decisionComment.maxLength;
  });

  commentLengthErrorMessage = computed(() => {
    const limit = formInputLimits.decisionComment.maxLength;
    return this.translateService.instant('preprints.details.decision.commentLengthError', {
      limit,
      difference: Math.abs(limit - this.reviewerComment()!.length).toString(),
    });
  });

  requestDecisionJustificationErrorMessage = computed(() => {
    const justification = this.requestDecisionJustification();
    const minLength = formInputLimits.requestDecisionJustification.minLength;

    if (!justification) return this.translateService.instant('preprints.details.decision.justificationRequiredError');
    if (justification.length < minLength)
      return this.translateService.instant('preprints.details.decision.justificationLengthError', {
        minLength,
      });

    return null;
  });

  decisionChanged = computed(() => {
    return this.preprint()?.reviewsState !== this.decision();
  });

  constructor() {
    effect(() => {
      const preprint = this.preprint();
      const latestAction = this.latestAction();
      if (preprint && latestAction) {
        if (preprint.reviewsState === ReviewsState.Pending) {
          this.decision.set(ReviewsState.Accepted);
          this.initialReviewerComment.set(null);
          this.reviewerComment.set(null);
        } else {
          this.decision.set(preprint.reviewsState);
          this.initialReviewerComment.set(latestAction?.comment);
          this.reviewerComment.set(latestAction?.comment);
        }
      }
    });

    effect(() => {
      const withdrawalRequest = this.latestWithdrawalRequest();
      if (!withdrawalRequest) return;

      this.requestDecisionJustification.set(withdrawalRequest.comment);
    });
  }

  submit() {
    // don't remove comments
    const preprint = this.preprint()!;
    let trigger = '';
    if (preprint.reviewsState !== ReviewsState.Pending && this.commentEdited() && !this.decisionChanged()) {
      // If the submission is not pending,
      // the decision has not changed and the comment is edited.
      // the trigger would be 'edit_comment'
      trigger = 'edit_comment';
    } else {
      let actionType = '';
      if (preprint.isPublished && this.isPendingWithdrawal()) {
        // if the submission is published and is pending withdrawal.
        // actionType would be 'reject'
        // meaning moderators could accept/reject the withdrawl request
        actionType = 'reject';
      } else if (preprint.isPublished && !this.isPendingWithdrawal()) {
        // if the submission is published and is not pending withdrawal
        // actionType would be 'withdraw'
        // meaning moderators could approve/directly withdraw the submission
        actionType = 'withdraw';
      } else {
        // Otherwise
        // actionType would be 'reject'
        // meaning the moderator could either accept or reject the submission
        actionType = 'reject';
      }
      // If the decision is to accept the submission or the withdrawal request,
      // the trigger is 'accept'
      // If not, then the trigger is whatever 'actionType' set above.
      trigger = this.decision() === ReviewsState.Accepted ? 'accept' : actionType;
    }

    let comment: StringOrNull = '';
    if (this.isPendingWithdrawal()) {
      if (trigger === 'reject') {
        this.didValidate.set(true);
        if (this.requestDecisionJustificationErrorMessage() !== null) {
          return;
        }
      }

      comment = this.requestDecisionJustification()?.trim() || null;
    } else {
      comment = this.reviewerComment()?.trim() || null;
    }

    this.saving.set(true);
    if (this.isPendingWithdrawal()) {
      this.actions.submitRequestsDecision(this.latestWithdrawalRequest()!.id, trigger, comment).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['preprints', this.provider().id, 'moderation', 'withdrawals']);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    } else {
      this.actions.submitReviewsDecision(trigger, comment).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['preprints', this.provider().id, 'moderation', 'submissions']);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    }
  }

  requestDecisionToggled() {
    if (!this.isPendingWithdrawal()) {
      return;
    }

    if (this.decision() === ReviewsState.Accepted) {
      this.requestDecisionJustification.set(this.latestWithdrawalRequest()?.comment || null);
    } else if (this.decision() === ReviewsState.Rejected) {
      this.requestDecisionJustification.set(null);
    }
  }

  cancel() {
    this.dialogVisible = false;
    this.decision.set(this.preprint()!.reviewsState);
    this.reviewerComment.set(this.initialReviewerComment());
  }
}
