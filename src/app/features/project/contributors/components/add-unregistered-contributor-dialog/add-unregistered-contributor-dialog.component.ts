import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { CustomValidators } from '@osf/shared/utils';

import { AddContributorType, ContributorPermission } from '../../enums';
import { ContributorAddModel, UnregisteredContributorForm } from '../../models';
import { ContributorDialogAddModel } from '../../models/contributor-dialog-add.model';

@Component({
  selector: 'osf-add-unregistered-contributor-dialog',
  imports: [Button, ReactiveFormsModule, TranslatePipe, TextInputComponent],
  templateUrl: './add-unregistered-contributor-dialog.component.html',
  styleUrl: './add-unregistered-contributor-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUnregisteredContributorDialogComponent {
  protected dialogRef = inject(DynamicDialogRef);
  protected contributorForm!: FormGroup<UnregisteredContributorForm>;
  protected inputLimits = InputLimits;

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
    const data: ContributorDialogAddModel = { data: [], type: AddContributorType.Unregistered };
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
      isBibliographic: false,
      permission: ContributorPermission.Read,
    };
    const data: ContributorDialogAddModel = { data: [contributorData], type: AddContributorType.Unregistered };
    this.dialogRef.close(data);
  }
}
