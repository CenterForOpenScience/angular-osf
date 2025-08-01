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
import { DateAgoPipe } from '@osf/shared/pipes';
import { ModerationDecisionFormControls, ModerationSubmitType } from '@shared/enums';
import { CollectionsSelectors } from '@shared/stores';

@Component({
  selector: 'osf-make-decision-dialog',
  imports: [Button, TranslatePipe, DateAgoPipe, FormsModule, RadioButton, ReactiveFormsModule, Textarea],
  templateUrl: './make-decision-dialog.component.html',
  styleUrl: './make-decision-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakeDecisionDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly config = inject(DynamicDialogConfig);
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly ModerationSubmitType = ModerationSubmitType;
  protected readonly SubmissionReviewStatus = SubmissionReviewStatus;
  protected readonly ModerationDecisionFormControls = ModerationDecisionFormControls;
  protected collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  protected currentReviewAction = select(CollectionsModerationSelectors.getCurrentReviewAction);

  protected isSubmitting = select(CollectionsModerationSelectors.getCollectionSubmissionSubmitting);
  protected requestForm!: FormGroup;

  protected actions = createDispatchMap({
    createSubmissionAction: CreateCollectionSubmissionAction,
  });

  protected isHybridModeration = computed(() => {
    const provider = this.collectionProvider();
    return provider?.reviewsWorkflow === ModerationType.Hybrid || !provider?.reviewsWorkflow;
  });

  protected isPreModeration = computed(() => {
    const provider = this.collectionProvider();
    return provider?.reviewsWorkflow === ModerationType.Pre;
  });

  protected isPostModeration = computed(() => {
    const provider = this.collectionProvider();
    return provider?.reviewsWorkflow === ModerationType.Post;
  });

  protected isPendingStatus = computed(() => {
    return this.currentReviewAction()?.toState === SubmissionReviewStatus.Pending;
  });

  ngOnInit() {
    this.initForm();
  }

  protected handleSubmission(): void {
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
      [ModerationDecisionFormControls.Comment]: new FormControl(''),
    });
  }
}
