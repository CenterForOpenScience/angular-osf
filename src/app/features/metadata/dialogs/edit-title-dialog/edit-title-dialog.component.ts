import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';

import { DialogValueModel } from '../../models';

@Component({
  selector: 'osf-edit-title-dialog',
  imports: [Button, TranslatePipe, TextInputComponent, ReactiveFormsModule],
  templateUrl: './edit-title-dialog.component.html',
  styleUrl: './edit-title-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTitleDialogComponent {
  dialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  titleLimit = InputLimits.title.maxLength;

  titleControl = new FormControl(this.config.data || '', [CustomValidators.requiredTrimmed()]);

  save(): void {
    this.dialogRef.close({ value: this.titleControl.value } as DialogValueModel);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
