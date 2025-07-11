import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Password } from 'primeng/password';

import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { AccountSettingsPasswordForm, AccountSettingsPasswordFormControls } from '../../models';
import { AccountSettingsService } from '../../services';

@Component({
  selector: 'osf-change-password',
  imports: [ReactiveFormsModule, Password, CommonModule, Button, TranslatePipe],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
  private readonly accountSettingsService = inject(AccountSettingsService);
  private readonly translateService = inject(TranslateService);

  readonly passwordForm: AccountSettingsPasswordForm = new FormGroup({
    [AccountSettingsPasswordFormControls.OldPassword]: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    [AccountSettingsPasswordFormControls.NewPassword]: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&*])[A-Za-z\d!@#$%^&*_]{8,}$/),
      ],
    }),
    [AccountSettingsPasswordFormControls.ConfirmPassword]: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected readonly AccountSettingsPasswordFormControls = AccountSettingsPasswordFormControls;
  protected errorMessage = signal('');

  ngOnInit(): void {
    this.passwordForm.addValidators((control: AbstractControl): ValidationErrors | null => {
      const oldPassword = control.get(AccountSettingsPasswordFormControls.OldPassword)?.value;
      const newPassword = control.get(AccountSettingsPasswordFormControls.NewPassword)?.value;
      const confirmPassword = control.get(AccountSettingsPasswordFormControls.ConfirmPassword)?.value;

      const errors: ValidationErrors = {};

      if (oldPassword && newPassword && oldPassword === newPassword) {
        errors['sameAsOldPassword'] = true;
      }

      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        errors['passwordMismatch'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    });

    this.passwordForm.get(AccountSettingsPasswordFormControls.OldPassword)?.valueChanges.subscribe(() => {
      this.passwordForm.updateValueAndValidity();
    });

    this.passwordForm.get(AccountSettingsPasswordFormControls.NewPassword)?.valueChanges.subscribe(() => {
      this.passwordForm.updateValueAndValidity();
    });

    this.passwordForm.get(AccountSettingsPasswordFormControls.ConfirmPassword)?.valueChanges.subscribe(() => {
      this.passwordForm.updateValueAndValidity();
    });
  }

  changePassword() {
    Object.values(this.passwordForm.controls).forEach((control) => {
      control.markAsTouched();
    });

    if (this.passwordForm.valid) {
      this.errorMessage.set('');
      const oldPassword = this.passwordForm.get(AccountSettingsPasswordFormControls.OldPassword)?.value ?? '';
      const newPassword = this.passwordForm.get(AccountSettingsPasswordFormControls.NewPassword)?.value ?? '';

      this.accountSettingsService.updatePassword(oldPassword, newPassword).subscribe({
        next: () => {
          this.passwordForm.reset();
          Object.values(this.passwordForm.controls).forEach((control) => {
            control.markAsUntouched();
          });
        },
        error: (error: HttpErrorResponse) => {
          if (error.error?.errors?.[0]?.detail) {
            this.errorMessage.set(error.error.errors[0].detail);
          } else {
            this.errorMessage.set(
              this.translateService.instant('settings.accountSettings.changePassword.messages.error')
            );
          }
        },
      });
    }
  }
}
