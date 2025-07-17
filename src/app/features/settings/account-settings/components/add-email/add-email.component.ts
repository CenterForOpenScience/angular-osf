import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { ToastService } from '@osf/shared/services';
import { CustomValidators } from '@osf/shared/utils';

import { AccountSettingsSelectors, AddEmail } from '../../store';

@Component({
  selector: 'osf-confirmation-sent-dialog',
  imports: [TextInputComponent, ReactiveFormsModule, Button, TranslatePipe],
  templateUrl: './add-email.component.html',
  styleUrl: './add-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmailComponent {
  readonly dialogRef = inject(DynamicDialogRef);

  private readonly action = createDispatchMap({ addEmail: AddEmail });
  private readonly toastService = inject(ToastService);

  isSubmitting = select(AccountSettingsSelectors.isEmailsSubmitting);

  protected readonly emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.email, CustomValidators.requiredTrimmed()],
  });

  emailMaxLength = InputLimits.email.maxLength;

  constructor() {
    effect(() => (this.isSubmitting() ? this.emailControl.disable() : this.emailControl.enable()));
  }

  addEmail() {
    if (this.emailControl.invalid) {
      return;
    }

    this.action.addEmail(this.emailControl.value).subscribe(() => {
      this.dialogRef.close(this.emailControl.value);
      this.toastService.showSuccess('settings.accountSettings.connectedEmails.successAdd');
    });
  }
}
