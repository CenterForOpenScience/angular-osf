import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { finalize, take } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { WithdrawRegistration } from '@osf/features/registry/store/registry';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';

@Component({
  selector: 'osf-registration-withdraw-dialog',
  imports: [TranslatePipe, TextInputComponent, Button],
  templateUrl: './registration-withdraw-dialog.component.html',
  styleUrl: './registration-withdraw-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationWithdrawDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly actions = createDispatchMap({ withdrawRegistration: WithdrawRegistration });

  readonly form = new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: [CustomValidators.requiredTrimmed()] }),
  });
  readonly inputLimits = InputLimits;

  submitting = false;

  withdrawRegistration(): void {
    const registryId = this.config.data.registryId;
    if (registryId) {
      this.submitting = true;
      this.actions
        .withdrawRegistration(registryId, this.form.controls.text.value ?? '')
        .pipe(
          take(1),
          finalize(() => {
            this.submitting = false;
            this.dialogRef.close();
          })
        )
        .subscribe();
    }
  }
}
