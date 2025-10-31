import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { forbiddenFileNameCharacters, InputLimits } from '@osf/shared/constants/input-limits.const';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';

@Component({
  selector: 'osf-create-folder-dialog',
  imports: [Button, ReactiveFormsModule, TranslatePipe, TextInputComponent],
  templateUrl: './create-folder-dialog.component.html',
})
export class CreateFolderDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly nameLimit = InputLimits.name.maxLength;
  readonly nameMinLength = InputLimits.name.minLength;

  readonly folderForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        CustomValidators.requiredTrimmed(),
        CustomValidators.forbiddenCharactersValidator(forbiddenFileNameCharacters),
        CustomValidators.noPeriodAtEnd(),
      ],
    }),
  });

  onSubmit(): void {
    if (this.folderForm.invalid) {
      return;
    }

    const folderName = this.folderForm.getRawValue().name.trim();

    if (folderName) {
      this.dialogRef.close(folderName);
    }
  }
}
