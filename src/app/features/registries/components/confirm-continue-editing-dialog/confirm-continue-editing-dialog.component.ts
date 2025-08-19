import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Textarea } from 'primeng/textarea';

import { finalize } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SchemaActionTrigger } from '../../enums';
import { HandleSchemaResponse } from '../../store';

@Component({
  selector: 'osf-confirm-continue-editing-dialog',
  imports: [ReactiveFormsModule, Textarea, TranslatePipe, Button],
  templateUrl: './confirm-continue-editing-dialog.component.html',
  styleUrl: './confirm-continue-editing-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmContinueEditingDialogComponent {
  protected readonly dialogRef = inject(DynamicDialogRef);
  private readonly fb = inject(FormBuilder);
  readonly config = inject(DynamicDialogConfig);
  private readonly destroyRef = inject(DestroyRef);

  protected actions = createDispatchMap({
    handleSchemaResponse: HandleSchemaResponse,
  });

  isSubmitting = false;

  form: FormGroup = this.fb.group({
    comment: [''],
  });

  submit(): void {
    const comment = this.form.value.comment;
    const revisionId = this.config.data.revisionId;
    this.isSubmitting = true;
    this.actions
      .handleSchemaResponse(revisionId, SchemaActionTrigger.AdminReject, comment)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        })
      )
      .subscribe();
  }
}
