import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormSelectComponent, TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { CustomValidators } from '@osf/shared/helpers';

import { MODERATION_PERMISSIONS } from '../../constants';
import { AddModeratorType, ModeratorPermission } from '../../enums';
import { InviteModeratorForm, ModeratorAddModel, ModeratorDialogAddModel } from '../../models';

@Component({
  selector: 'osf-invite-moderator-dialog',
  imports: [Button, ReactiveFormsModule, TranslatePipe, TextInputComponent, FormSelectComponent],
  templateUrl: './invite-moderator-dialog.component.html',
  styleUrl: './invite-moderator-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InviteModeratorDialogComponent {
  dialogRef = inject(DynamicDialogRef);
  moderatorForm!: FormGroup<InviteModeratorForm>;
  inputLimits = InputLimits;
  readonly permissionsOptions = MODERATION_PERMISSIONS;

  constructor() {
    this.initForm();
  }

  initForm() {
    this.moderatorForm = new FormGroup<InviteModeratorForm>({
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
      permission: new FormControl(ModeratorPermission.Moderator, {
        nonNullable: true,
      }),
    });
  }

  searchModerator() {
    const data: ModeratorDialogAddModel = { data: [], type: AddModeratorType.Search };
    this.dialogRef.close(data);
  }

  submit(): void {
    if (this.moderatorForm.invalid) {
      return;
    }

    const formData = this.moderatorForm.value;
    const moderatorData: ModeratorAddModel = {
      fullName: formData.fullName,
      email: formData.email,
      permission: formData.permission || ModeratorPermission.Moderator,
    };
    const data: ModeratorDialogAddModel = { data: [moderatorData], type: AddModeratorType.Invite };
    this.dialogRef.close(data);
  }
}
