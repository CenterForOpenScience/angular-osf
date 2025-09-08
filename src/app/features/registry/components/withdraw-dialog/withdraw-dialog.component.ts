import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { finalize, take } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { WithdrawRegistration } from '@osf/features/registry/store/registry-overview';
import { InputLimits } from '@osf/shared/constants';
import { TextInputComponent } from '@shared/components';

@Component({
  selector: 'osf-withdraw-dialog',
  imports: [TranslatePipe, TextInputComponent, Button],
  templateUrl: './withdraw-dialog.component.html',
  styleUrl: './withdraw-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly actions = createDispatchMap({ withdrawRegistration: WithdrawRegistration });

  readonly form = new FormGroup({ text: new FormControl('') });
  readonly inputLimits = InputLimits;

  withdrawRegistration(): void {
    const registryId = this.config.data.registryId;
    if (registryId) {
      this.actions
        .withdrawRegistration(registryId, this.form.controls.text.value ?? '')
        .pipe(
          take(1),
          finalize(() => this.dialogRef.close())
        )
        .subscribe();
    }
  }
}
