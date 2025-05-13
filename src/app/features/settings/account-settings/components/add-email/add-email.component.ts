import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { AddEmail } from '@osf/features/settings/account-settings/store/account-settings.actions';

@Component({
  selector: 'osf-add-email',
  imports: [InputText, ReactiveFormsModule, Button, TranslatePipe],
  templateUrl: './add-email.component.html',
  styleUrl: './add-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmailComponent {
  readonly #store = inject(Store);
  readonly dialogRef = inject(DynamicDialogRef);

  protected readonly emailControl = new FormControl('', [Validators.email, Validators.required]);

  addEmail() {
    if (this.emailControl.value) {
      this.#store.dispatch(new AddEmail(this.emailControl.value));
    }
    this.dialogRef.close();
  }
}
