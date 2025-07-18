import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { CustomValidators } from '@osf/shared/utils';

@Component({
  selector: 'osf-create-folder-dialog',
  imports: [Button, ReactiveFormsModule, TranslatePipe, TextInputComponent],
  templateUrl: './create-folder-dialog.component.html',
})
export class CreateFolderDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly nameLimit = InputLimits.name.maxLength;
  readonly nameMinLength = InputLimits.name.minLength;

  protected readonly folderForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [CustomValidators.requiredTrimmed()],
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
