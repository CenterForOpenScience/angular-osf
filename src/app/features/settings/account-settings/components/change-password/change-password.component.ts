import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Password } from 'primeng/password';

import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { LoaderService, ToastService } from '@osf/shared/services';
import { CustomValidators, FormValidationHelper } from '@osf/shared/utils';

import { AccountSettingsPasswordForm, AccountSettingsPasswordFormControls } from '../../models';
import { UpdatePassword } from '../../store';

@Component({
  selector: 'osf-change-password',
  imports: [Card, ReactiveFormsModule, Password, CommonModule, Button, TranslatePipe],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
  private readonly actions = createDispatchMap({ updatePassword: UpdatePassword });
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly passwordForm: AccountSettingsPasswordForm = new FormGroup({
    [AccountSettingsPasswordFormControls.OldPassword]: new FormControl('', {
      nonNullable: true,
      validators: [CustomValidators.requiredTrimmed()],
    }),
    [AccountSettingsPasswordFormControls.NewPassword]: new FormControl('', {
      nonNullable: true,
      validators: [
        CustomValidators.requiredTrimmed(),
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&*])[A-Za-z\d!@#$%^&*_]{8,}$/),
      ],
    }),
    [AccountSettingsPasswordFormControls.ConfirmPassword]: new FormControl('', {
      nonNullable: true,
      validators: [CustomValidators.requiredTrimmed()],
    }),
  });

  protected readonly AccountSettingsPasswordFormControls = AccountSettingsPasswordFormControls;
  protected readonly FormValidationHelper = FormValidationHelper;

  protected errorMessage = signal('');

  ngOnInit(): void {
    this.setupFormValidation();
  }

  private setupFormValidation(): void {
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

    this.passwordForm
      .get(AccountSettingsPasswordFormControls.OldPassword)
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.passwordForm.updateValueAndValidity());

    this.passwordForm
      .get(AccountSettingsPasswordFormControls.NewPassword)
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.passwordForm.updateValueAndValidity());

    this.passwordForm
      .get(AccountSettingsPasswordFormControls.ConfirmPassword)
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.passwordForm.updateValueAndValidity());
  }

  protected getFormControl(controlName: string): AbstractControl | null {
    return FormValidationHelper.getFormControl(this.passwordForm, controlName);
  }

  protected getFormErrors(): Record<string, boolean> {
    const errors: Record<string, boolean> = {};

    if (this.passwordForm.errors?.['sameAsOldPassword']) {
      errors['sameAsOldPassword'] = true;
    }

    if (this.passwordForm.errors?.['passwordMismatch']) {
      errors['passwordMismatch'] = true;
    }

    return errors;
  }

  changePassword() {
    Object.values(this.passwordForm.controls).forEach((control) => {
      control.markAsTouched();
    });

    if (this.passwordForm.valid) {
      this.errorMessage.set('');

      const oldPassword = this.passwordForm.get(AccountSettingsPasswordFormControls.OldPassword)?.value ?? '';
      const newPassword = this.passwordForm.get(AccountSettingsPasswordFormControls.NewPassword)?.value ?? '';

      this.loaderService.show();

      this.actions.updatePassword(oldPassword, newPassword).subscribe({
        next: () => {
          this.passwordForm.reset();
          Object.values(this.passwordForm.controls).forEach((control) => {
            control.markAsUntouched();
          });

          this.loaderService.hide();
          this.toastService.showSuccess('settings.accountSettings.changePassword.messages.success');
        },
        error: (error: HttpErrorResponse) => {
          if (error.error?.errors?.[0]?.detail) {
            this.errorMessage.set(error.error.errors[0].detail);
          } else {
            this.errorMessage.set('settings.accountSettings.changePassword.messages.error');
          }

          this.loaderService.hide();
        },
      });
    }
  }
}
