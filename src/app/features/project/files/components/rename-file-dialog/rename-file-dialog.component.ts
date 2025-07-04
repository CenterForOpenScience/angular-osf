import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { CustomValidators } from '@osf/shared/utils';

@Component({
  selector: 'osf-rename-file-dialog',
  imports: [Button, TextInputComponent, ReactiveFormsModule, TranslatePipe],
  templateUrl: './rename-file-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenameFileDialogComponent {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly nameLimit = InputLimits.name.maxLength;
  readonly nameMinLength = InputLimits.name.minLength;

  protected readonly renameForm = new FormGroup({
    name: new FormControl(this.config.data?.currentName ?? '', {
      nonNullable: true,
      validators: [CustomValidators.requiredTrimmed()],
    }),
  });

  onSubmit(): void {
    if (this.renameForm.valid) {
      const newName = this.renameForm.getRawValue().name;
      this.dialogRef.close(newName);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
