import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { RadioButton } from 'primeng/radiobutton';
import { Textarea } from 'primeng/textarea';

import { tap } from 'rxjs';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { SubmissionReviewStatus } from '@osf/features/moderation/enums';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants';
import {
  ModerationDecisionFormControls,
  RegistrationReviewStates,
  ReviewActionTrigger,
  RevisionReviewStates,
  SchemaResponseActionTrigger,
} from '@osf/shared/enums';
import { DateAgoPipe } from '@osf/shared/pipes';

import { RegistryOverview } from '../../models';
import { RegistryOverviewSelectors, SubmitDecision } from '../../store/registry-overview';

@Component({
  selector: 'osf-registry-make-decision',
  imports: [
    Button,
    TranslatePipe,
    DateAgoPipe,
    FormsModule,
    RadioButton,
    ReactiveFormsModule,
    Textarea,
    DatePipe,
    Message,
  ],
  templateUrl: './registry-make-decision.component.html',
  styleUrl: './registry-make-decision.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryMakeDecisionComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly config = inject(DynamicDialogConfig);
  protected readonly dialogRef = inject(DynamicDialogRef);

  protected readonly ReviewActionTrigger = ReviewActionTrigger;
  protected readonly SchemaResponseActionTrigger = SchemaResponseActionTrigger;
  protected readonly SubmissionReviewStatus = SubmissionReviewStatus;
  protected readonly ModerationDecisionFormControls = ModerationDecisionFormControls;
  protected reviewActions = select(RegistryOverviewSelectors.getReviewActions);

  protected isSubmitting = select(RegistryOverviewSelectors.isReviewActionSubmitting);
  protected requestForm!: FormGroup;

  protected actions = createDispatchMap({
    submitDecision: SubmitDecision,
  });

  registry = this.config.data.registry as RegistryOverview;
  embargoEndDate = this.registry.embargoEndDate;

  RevisionReviewStates = RevisionReviewStates;
  RegistrationReviewStates = RegistrationReviewStates;

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  get isPendingModeration(): boolean {
    return this.registry.revisionStatus === RevisionReviewStates.RevisionPendingModeration;
  }

  get isPendingReview(): boolean {
    return this.registry.reviewsState === RegistrationReviewStates.Pending;
  }

  get canWithdraw(): boolean {
    return (
      this.registry.reviewsState === RegistrationReviewStates.Accepted &&
      this.registry.revisionStatus === RevisionReviewStates.Approved
    );
  }
  get isCommentInvalid(): boolean {
    return (
      this.requestForm.controls[ModerationDecisionFormControls.Comment].errors?.['required'] &&
      (this.requestForm.controls[ModerationDecisionFormControls.Comment].touched ||
        this.requestForm.controls[ModerationDecisionFormControls.Comment].dirty)
    );
  }

  constructor() {
    this.initForm();

    this.requestForm
      .get(ModerationDecisionFormControls.Action)
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((action) => {
        this.updateCommentValidators(action);
      });
  }

  protected handleSubmission(): void {
    const revisionId = this.config.data.revisionId;
    this.actions
      .submitDecision(
        {
          targetId: revisionId ? revisionId : this.registry.id,
          action: this.requestForm.value[ModerationDecisionFormControls.Action],
          comment: this.requestForm.value[ModerationDecisionFormControls.Comment],
        },
        !!revisionId
      )
      .pipe(tap(() => this.dialogRef.close(this.requestForm.value)))
      .subscribe();
  }

  protected isCommentRequired(action: string): boolean {
    return (
      action === ReviewActionTrigger.RejectSubmission ||
      action === SchemaResponseActionTrigger.RejectRevision ||
      action === ReviewActionTrigger.ForceWithdraw
    );
  }

  private updateCommentValidators(action: string): void {
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

  private initForm(): void {
    this.requestForm = this.fb.group({
      [ModerationDecisionFormControls.Action]: new FormControl('', [Validators.required]),
      [ModerationDecisionFormControls.Comment]: new FormControl(''),
    });
  }
}
