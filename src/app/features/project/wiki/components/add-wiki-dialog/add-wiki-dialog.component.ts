import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { ToastService } from '@osf/shared/services';
import { CustomValidators } from '@osf/shared/utils';

import { CreateWiki, WikiSelectors } from '../../store';

@Component({
  selector: 'osf-add-wiki-dialog-component',
  imports: [Button, ReactiveFormsModule, TranslatePipe, TextInputComponent],
  templateUrl: './add-wiki-dialog.component.html',
  styleUrl: './add-wiki-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWikiDialogComponent {
  protected readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  protected actions = createDispatchMap({
    createWiki: CreateWiki,
  });
  protected isSubmitting = select(WikiSelectors.getWikiSubmitting);
  protected inputLimits = InputLimits;
  private toastService = inject(ToastService);

  addWikiForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [CustomValidators.requiredTrimmed(), Validators.maxLength(InputLimits.fullName.maxLength)],
    }),
  });

  submitForm(): void {
    if (this.addWikiForm.valid) {
      this.actions.createWiki(this.config.data.projectId, this.addWikiForm.value.name ?? '').subscribe({
        next: (res) => {
          this.toastService.showSuccess('project.wiki.addWikiSuccess');
          this.dialogRef.close(res);
        },
      });
    }
  }
}
