import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputLimits } from '@osf/shared/constants';
import { AddContributorType, ContributorPermission } from '@osf/shared/enums';
import { CustomValidators } from '@osf/shared/helpers';
import { ContributorAddModel, ContributorDialogAddModel, UnregisteredContributorForm } from '@osf/shared/models';

import { TextInputComponent } from '../../text-input/text-input.component';

@Component({
  selector: 'osf-add-unregistered-contributor-dialog',
  imports: [Button, ReactiveFormsModule, TranslatePipe, TextInputComponent],
  templateUrl: './add-unregistered-contributor-dialog.component.html',
  styleUrl: './add-unregistered-contributor-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUnregisteredContributorDialogComponent {
  dialogRef = inject(DynamicDialogRef);
  contributorForm!: FormGroup<UnregisteredContributorForm>;
  inputLimits = InputLimits;

  constructor() {
    this.initForm();
  }

  initForm() {
    this.contributorForm = new FormGroup<UnregisteredContributorForm>({
      fullName: new FormControl('', {
        nonNullable: true,
        validators: [CustomValidators.requiredTrimmed(), Validators.maxLength(InputLimits.fullName.maxLength)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          CustomValidators.requiredTrimmed(),
          CustomValidators.emailValidator(),
          Validators.maxLength(InputLimits.email.maxLength),
        ],
      }),
    });
  }

  addRegistered() {
    const data: ContributorDialogAddModel = { data: [], type: AddContributorType.Registered };
    this.dialogRef.close(data);
  }

  submit(): void {
    if (this.contributorForm.invalid) {
      return;
    }

    const formData = this.contributorForm.value;
    const contributorData: ContributorAddModel = {
      fullName: formData.fullName,
      email: formData.email,
      isBibliographic: true,
      permission: ContributorPermission.Write,
    };
    const data: ContributorDialogAddModel = { data: [contributorData], type: AddContributorType.Unregistered };
    this.dialogRef.close(data);
  }
}
