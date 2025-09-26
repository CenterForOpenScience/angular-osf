import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DialogValueModel } from '../../models';

@Component({
  selector: 'osf-description-dialog',
  imports: [Button, TranslatePipe, Textarea, ReactiveFormsModule],
  templateUrl: './description-dialog.component.html',
  styleUrl: './description-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionDialogComponent {
  dialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  descriptionControl = new FormControl(this.config.data || '');

  save(): void {
    this.dialogRef.close({ value: this.descriptionControl.value } as DialogValueModel);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
