import { NgxCaptchaModule } from 'ngx-captcha';
import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Divider } from 'primeng/divider';
import { Password } from 'primeng/password';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { SignUpModel } from '@osf/core/models';
import { AuthService } from '@osf/core/services';
import { PasswordInputHintComponent, TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { CustomValidators, PASSWORD_REGEX } from '@osf/shared/helpers';

import { SignUpForm } from '../../models';

import { environment } from 'src/environments/environment';

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

  signUpForm = new FormGroup<SignUpForm>({} as SignUpForm);
  passwordRegex: RegExp = PASSWORD_REGEX;
  inputLimits = InputLimits;
  isFormSubmitted = signal(false);

  readonly siteKey = environment.recaptchaSiteKey;

  get isPasswordError() {
    return this.signUpForm.controls['password'].errors && this.signUpForm.get('password')?.touched;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.signUpForm = new FormGroup<SignUpForm>({
      fullName: new FormControl('', { nonNullable: true, validators: CustomValidators.requiredTrimmed() }),
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
        validators: [CustomValidators.requiredTrimmed(), Validators.pattern(this.passwordRegex)],
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
      error: () => {
        this.signUpForm.enable();
      },
    });
  }

  navigateToOrcidSingIn(): void {
    this.authService.navigateToOrcidSingIn();
  }

  navigateToInstitutionSingIn(): void {
    this.authService.navigateToInstitutionSignIn();
  }
}
