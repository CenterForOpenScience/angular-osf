import { FormControl, FormGroup } from '@angular/forms';

export type ResetPasswordFormGroupType = FormGroup<{
  newPassword: FormControl;
  confirmNewPassword: FormControl;
}>;
