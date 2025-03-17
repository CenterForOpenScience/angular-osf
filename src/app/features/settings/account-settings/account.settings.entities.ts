import { FormControl, FormGroup } from '@angular/forms';

export enum AccountSettingsPasswordFormControls {
  OldPassword = 'oldPassword',
  NewPassword = 'newPassword',
  ConfirmPassword = 'confirmPassword',
}

export type AccountSettingsPasswordForm = FormGroup<{
  [AccountSettingsPasswordFormControls.OldPassword]: FormControl<string>;
  [AccountSettingsPasswordFormControls.NewPassword]: FormControl<string>;
  [AccountSettingsPasswordFormControls.ConfirmPassword]: FormControl<string>;
}>;
