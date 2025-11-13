import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';
import { ToastService } from '@osf/shared/services/toast.service';
import { CreateWiki, WikiSelectors } from '@osf/shared/stores/wiki';

import { TextInputComponent } from '../../text-input/text-input.component';

@Component({
  selector: 'osf-add-wiki-dialog-component',
  imports: [Button, ReactiveFormsModule, TranslatePipe, TextInputComponent],
  templateUrl: './add-wiki-dialog.component.html',
  styleUrl: './add-wiki-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWikiDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  private toastService = inject(ToastService);

  actions = createDispatchMap({ createWiki: CreateWiki });
  isSubmitting = select(WikiSelectors.getWikiSubmitting);
  inputLimits = InputLimits;

  addWikiForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [CustomValidators.requiredTrimmed(), Validators.maxLength(InputLimits.fullName.maxLength)],
    }),
  });

  submitForm(): void {
    if (this.addWikiForm.valid) {
      this.actions
        .createWiki(ResourceType.Project, this.config.data.resourceId, this.addWikiForm.value.name ?? '')
        .subscribe({
          next: (res) => {
            this.toastService.showSuccess('project.wiki.addWikiSuccess');
            this.dialogRef.close(res);
          },
        });
    }
  }
}
