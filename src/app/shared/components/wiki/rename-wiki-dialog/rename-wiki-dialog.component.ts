import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';
import { ToastService } from '@osf/shared/services/toast.service';
import { RenameWiki, WikiSelectors } from '@osf/shared/stores/wiki';

import { TextInputComponent } from '../../text-input/text-input.component';

@Component({
  selector: 'osf-rename-wiki-dialog-component',
  imports: [Button, ReactiveFormsModule, TranslatePipe, TextInputComponent],
  templateUrl: './rename-wiki-dialog.component.html',
  styleUrl: './rename-wiki-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenameWikiDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  private toastService = inject(ToastService);

  actions = createDispatchMap({ renameWiki: RenameWiki });
  isSubmitting = select(WikiSelectors.getWikiSubmitting);
  inputLimits = InputLimits;

  renameWikiForm = new FormGroup({
    name: new FormControl(this.config.data.wikiName, {
      nonNullable: true,
      validators: [CustomValidators.requiredTrimmed(), Validators.maxLength(InputLimits.fullName.maxLength)],
    }),
  });

  submitForm(): void {
    if (this.renameWikiForm.valid) {
      this.actions.renameWiki(this.config.data.wikiId, this.renameWikiForm.value.name ?? '').subscribe({
        next: () => {
          this.toastService.showSuccess('project.wiki.renameWikiSuccess');
          this.dialogRef.close(true);
        },
        error: (err) => {
          if (err?.status === 409) {
            this.toastService.showError('project.wiki.renameWikiConflict');
          }
        },
      });
    }
  }
}
