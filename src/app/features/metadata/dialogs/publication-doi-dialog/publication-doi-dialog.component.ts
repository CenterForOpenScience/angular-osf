import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { CustomValidators } from '@osf/shared/helpers';

@Component({
  selector: 'osf-publication-doi-dialog',
  imports: [Button, TranslatePipe, InputText, InputGroup, InputGroupAddon, ReactiveFormsModule],
  templateUrl: './publication-doi-dialog.component.html',
  styleUrl: './publication-doi-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationDoiDialogComponent {
  dialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  publicationDoiControl = new FormControl(this.config.data.publicationDoi || '', {
    nonNullable: true,
    validators: [Validators.required, CustomValidators.doiValidator],
  });

  save(): void {
    this.dialogRef.close(this.publicationDoiControl.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
