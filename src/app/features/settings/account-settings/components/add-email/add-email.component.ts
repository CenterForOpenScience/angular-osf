import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { CustomValidators } from '@osf/shared/utils';

import { AddEmail } from '../../store';

@Component({
  selector: 'osf-add-email',
  imports: [InputText, ReactiveFormsModule, Button, TranslatePipe],
  templateUrl: './add-email.component.html',
  styleUrl: './add-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmailComponent {
  readonly action = createDispatchMap({ addEmail: AddEmail });
  readonly dialogRef = inject(DynamicDialogRef);

  protected readonly emailControl = new FormControl('', [Validators.email, CustomValidators.requiredTrimmed()]);

  addEmail() {
    if (this.emailControl.value) {
      this.action.addEmail(this.emailControl.value);
    }

    this.dialogRef.close();
  }
}
