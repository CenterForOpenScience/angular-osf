import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { CustomValidators } from '@osf/shared/helpers';

import { DialogValueModel } from '../../models';

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

  publicationDoiControl = new FormControl(this.config.data || null, [CustomValidators.doiValidator]);

  save(): void {
    const value = !this.publicationDoiControl.value ? null : this.publicationDoiControl.value;
    this.dialogRef.close({ value } as DialogValueModel);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
