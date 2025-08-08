import { createDispatchMap } from '@ngxs/store';

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

import { NavigationService } from '@osf/core/services';
import { RegisterUser } from '@osf/features/auth/store';
import { PasswordInputHintComponent, TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { CustomValidators, PASSWORD_REGEX } from '@osf/shared/utils';

import { SignUpForm, SignUpModel } from '../../models';

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
  private readonly navigateService = inject(NavigationService);

  private readonly actions = createDispatchMap({ registerUser: RegisterUser });

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

    this.actions.registerUser(data).subscribe({
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
    this.navigateService.navigateToOrcidSingIn();
  }

  navigateToInstitutionSingIn(): void {
    this.navigateService.navigateToInstitutionSignIn();
  }
}
