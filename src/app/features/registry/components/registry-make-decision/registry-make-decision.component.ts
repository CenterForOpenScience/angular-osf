import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { RadioButton } from 'primeng/radiobutton';
import { Textarea } from 'primeng/textarea';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SubmissionReviewStatus } from '@osf/features/moderation/enums';
import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { ModerationDecisionFormControls } from '@osf/shared/enums/moderation-decision-form-controls.enum';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { ReviewActionTrigger, SchemaResponseActionTrigger } from '@osf/shared/enums/trigger-action.enum';
import { DateAgoPipe } from '@osf/shared/pipes/date-ago.pipe';

import { RegistrationOverviewModel } from '../../models';
import { RegistrySelectors, SubmitDecision } from '../../store/registry';

@Component({
  selector: 'osf-registry-make-decision',
  imports: [Button, RadioButton, Textarea, Message, ReactiveFormsModule, TranslatePipe, DateAgoPipe, DatePipe],
  templateUrl: './registry-make-decision.component.html',
  styleUrl: './registry-make-decision.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryMakeDecisionComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly dialogRef = inject(DynamicDialogRef);

  readonly ReviewActionTrigger = ReviewActionTrigger;
  readonly SubmissionReviewStatus = SubmissionReviewStatus;
  readonly ModerationDecisionFormControls = ModerationDecisionFormControls;
  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;
  readonly decisionCommentLimit = InputLimits.decisionComment.maxLength;

  readonly reviewActions = select(RegistrySelectors.getReviewActions);
  readonly isSubmitting = select(RegistrySelectors.isReviewActionSubmitting);

  private readonly actions = createDispatchMap({ submitDecision: SubmitDecision });

  readonly registry = this.config.data.registry as RegistrationOverviewModel;
  readonly embargoEndDate = this.registry.embargoEndDate;

  readonly isPendingModeration = this.registry.revisionState === RevisionReviewStates.RevisionPendingModeration;

  readonly isPendingReview = this.registry.reviewsState === RegistrationReviewStates.Pending;

  readonly isPendingWithdrawal = this.registry.reviewsState === RegistrationReviewStates.PendingWithdraw;

  readonly canWithdraw =
    this.registry.reviewsState === RegistrationReviewStates.Accepted &&
    this.registry.revisionState === RevisionReviewStates.Approved;

  readonly acceptValue = this.isPendingReview
    ? ReviewActionTrigger.AcceptSubmission
    : this.isPendingWithdrawal
      ? ReviewActionTrigger.AcceptWithdrawal
      : SchemaResponseActionTrigger.AcceptRevision;

  readonly rejectValue = this.isPendingReview
    ? ReviewActionTrigger.RejectSubmission
    : this.isPendingWithdrawal
      ? ReviewActionTrigger.RejectWithdrawal
      : SchemaResponseActionTrigger.RejectRevision;

  readonly requestForm = new FormGroup({
    [ModerationDecisionFormControls.Action]: new FormControl('', [Validators.required]),
    [ModerationDecisionFormControls.Comment]: new FormControl('', [Validators.maxLength(this.decisionCommentLimit)]),
  });

  get isCommentInvalid(): boolean {
    const comment = this.requestForm.controls[ModerationDecisionFormControls.Comment];
    return comment.errors?.['required'] && (comment.touched || comment.dirty);
  }

  constructor() {
    this.requestForm
      .get(ModerationDecisionFormControls.Action)
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((action) => {
        this.updateCommentValidators(action);
      });
  }

  handleSubmission(): void {
    const revisionId = this.config.data.revisionId;
    this.actions
      .submitDecision(
        {
          targetId: revisionId ? revisionId : this.registry.id,
          action: this.requestForm.value[ModerationDecisionFormControls.Action] ?? '',
          comment: this.requestForm.value[ModerationDecisionFormControls.Comment] ?? '',
        },
        !!revisionId
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.dialogRef.close(this.requestForm.value));
  }

  isCommentRequired(action: string | null): boolean {
    return (
      action === ReviewActionTrigger.RejectSubmission ||
      action === SchemaResponseActionTrigger.RejectRevision ||
      action === ReviewActionTrigger.RejectWithdrawal ||
      action === ReviewActionTrigger.ForceWithdraw
    );
  }

  private updateCommentValidators(action: string | null): void {
    const commentControl = this.requestForm.get(ModerationDecisionFormControls.Comment);
    if (commentControl) {
      if (this.isCommentRequired(action)) {
        commentControl.setValidators([Validators.required]);
      } else {
        commentControl.clearValidators();
      }
      commentControl.updateValueAndValidity();
    }
    this.requestForm.updateValueAndValidity();
  }
}
