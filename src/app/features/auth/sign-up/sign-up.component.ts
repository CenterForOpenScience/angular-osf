import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { PasswordInputHintComponent } from '@shared/components/password-input-hint/password-input-hint.component';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

import { PASSWORD_REGEX, passwordMatchValidator } from './sign-up.helper';

@Component({
  selector: 'osf-sign-up',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    DividerModule,
    NgOptimizedImage,
    RouterLink,
    PasswordInputHintComponent,
    TranslateModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup = new FormGroup({});
  passwordRegex: RegExp = PASSWORD_REGEX;
  #isMobile$ = inject(IS_XSMALL);
  isMobile = toSignal(this.#isMobile$);
  isFormSubmitted = signal(false);

  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.signUpForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
        confirmPassword: ['', Validators.required],
        agreeToTerms: [false, Validators.requiredTrue],
      },
      {
        validators: passwordMatchValidator(),
      }
    );
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      this.isFormSubmitted.set(true);
    }
  }
}
