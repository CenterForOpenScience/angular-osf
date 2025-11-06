import { NgxCaptchaModule } from 'ngx-captcha';
import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Divider } from 'primeng/divider';
import { Password } from 'primeng/password';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { SignUpModel } from '@core/models/sign-up.model';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { AuthService } from '@core/services/auth.service';
import { PasswordInputHintComponent } from '@osf/shared/components/password-input-hint/password-input-hint.component';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';
import { PASSWORD_REGEX } from '@osf/shared/helpers/password.helper';
import { ToastService } from '@osf/shared/services/toast.service';

import { SignUpForm } from '../../models';

@Component({
  selector: 'osf-sign-up',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    Password,
    Checkbox,
    Divider,
    NgOptimizedImage,
    RouterLink,
    PasswordInputHintComponent,
    TranslatePipe,
    NgxCaptchaModule,
    TextInputComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly environment = inject(ENVIRONMENT);

  signUpForm = new FormGroup<SignUpForm>({} as SignUpForm);
  inputLimits = InputLimits;
  isFormSubmitted = signal(false);

  readonly siteKey = this.environment.recaptchaSiteKey;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.signUpForm = new FormGroup<SignUpForm>({
      fullName: new FormControl('', { nonNullable: true, validators: CustomValidators.requiredTrimmed() }),
      givenName: new FormControl('', { nonNullable: true, validators: CustomValidators.requiredTrimmed() }),
      familyName: new FormControl('', { nonNullable: true, validators: CustomValidators.requiredTrimmed() }),
      email1: new FormControl('', {
        nonNullable: true,
        validators: [CustomValidators.requiredTrimmed(), Validators.email],
      }),
      email2: new FormControl('', {
        nonNullable: true,
        validators: [CustomValidators.requiredTrimmed(), Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [CustomValidators.requiredTrimmed(), Validators.minLength(8), Validators.pattern(PASSWORD_REGEX)],
      }),
      acceptedTermsOfService: new FormControl(false, {
        nonNullable: true,
        validators: Validators.requiredTrue,
      }),
      recaptcha: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
    });
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      return;
    }

    this.signUpForm.disable();

    const data = this.signUpForm.getRawValue() as SignUpModel;

    this.authService.register(data).subscribe({
      next: () => {
        this.signUpForm.reset();
        this.isFormSubmitted.set(true);
      },
      error: (error: HttpErrorResponse) => {
        this.signUpForm.enable();
        this.toastService.showError(error.error?.message_long);
      },
    });
  }

  navigateToOrcidSignIn(): void {
    this.authService.navigateToOrcidSignIn();
  }

  navigateToInstitutionSingIn(): void {
    this.authService.navigateToInstitutionSignIn();
  }
}
