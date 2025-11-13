import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RadioButton } from 'primeng/radiobutton';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ModerationType, SubmissionReviewStatus } from '@osf/features/moderation/enums';
import {
  CollectionsModerationSelectors,
  CreateCollectionSubmissionAction,
} from '@osf/features/moderation/store/collections-moderation';
import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { ModerationDecisionFormControls } from '@osf/shared/enums/moderation-decision-form-controls.enum';
import { ModerationSubmitType } from '@osf/shared/enums/moderation-submit-type.enum';
import { DateAgoPipe } from '@osf/shared/pipes/date-ago.pipe';
import { CollectionsSelectors } from '@osf/shared/stores/collections';

@Component({
  selector: 'osf-make-decision-dialog',
  imports: [Button, TranslatePipe, DateAgoPipe, FormsModule, RadioButton, ReactiveFormsModule, Textarea],
  templateUrl: './make-decision-dialog.component.html',
  styleUrl: './make-decision-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakeDecisionDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly config = inject(DynamicDialogConfig);
  readonly dialogRef = inject(DynamicDialogRef);

  readonly ModerationSubmitType = ModerationSubmitType;
  readonly SubmissionReviewStatus = SubmissionReviewStatus;
  readonly ModerationDecisionFormControls = ModerationDecisionFormControls;

  collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  currentReviewAction = select(CollectionsModerationSelectors.getCurrentReviewAction);

  isSubmitting = select(CollectionsModerationSelectors.getCollectionSubmissionSubmitting);
  requestForm!: FormGroup;

  decisionCommentLimit = InputLimits.decisionComment.maxLength;

  actions = createDispatchMap({
    createSubmissionAction: CreateCollectionSubmissionAction,
  });

  isHybridModeration = computed(() => {
    const provider = this.collectionProvider();
    return provider?.reviewsWorkflow === ModerationType.Hybrid || !provider?.reviewsWorkflow;
  });

  isPreModeration = computed(() => {
    const provider = this.collectionProvider();
    return provider?.reviewsWorkflow === ModerationType.Pre;
  });

  isPostModeration = computed(() => {
    const provider = this.collectionProvider();
    return provider?.reviewsWorkflow === ModerationType.Post;
  });

  isPendingStatus = computed(() => this.currentReviewAction()?.toState === SubmissionReviewStatus.Pending);
  isAcceptedStatus = computed(() => this.currentReviewAction()?.toState === SubmissionReviewStatus.Accepted);

  isRejectOptionVisible = computed(
    () => (this.isPreModeration() && this.isPendingStatus()) || (this.isHybridModeration() && this.isPendingStatus())
  );

  isWithdrawOptionVisible = computed(
    () =>
      (this.isPreModeration() && this.isAcceptedStatus()) ||
      (this.isHybridModeration() && !this.isPendingStatus()) ||
      this.isPostModeration()
  );

  ngOnInit() {
    this.initForm();
  }

  handleSubmission(): void {
    const targetId = this.currentReviewAction()?.targetId;
    if (this.requestForm.valid && targetId) {
      const formData = this.requestForm.value;
      const payload = { ...formData, targetId };

      this.actions.createSubmissionAction(payload).subscribe({
        next: () => {
          this.dialogRef.close(formData);
        },
      });
    }
  }

  get isSubmitDisabled(): boolean {
    const actionControl = this.requestForm?.get(ModerationDecisionFormControls.Action);
    return !actionControl?.value || this.isSubmitting()!;
  }

  private initForm(): void {
    this.requestForm = this.fb.group({
      [ModerationDecisionFormControls.Action]: new FormControl('', [Validators.required]),
      [ModerationDecisionFormControls.Comment]: new FormControl('', [Validators.maxLength(this.decisionCommentLimit)]),
    });
  }
}
