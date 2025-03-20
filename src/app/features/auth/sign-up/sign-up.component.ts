import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PASSWORD_REGEX, passwordMatchValidator } from './sign-up.helper';
import { Router, RouterLink } from '@angular/router';
import { PasswordInputHintComponent } from '@shared/components/password-input-hint/password-input-hint.component';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'osf-sign-up',
  standalone: true,
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
        password: [
          '',
          [Validators.required, Validators.pattern(this.passwordRegex)],
        ],
        confirmPassword: ['', Validators.required],
        agreeToTerms: [false, Validators.requiredTrue],
      },
      {
        validators: passwordMatchValidator(),
      },
    );
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      this.isFormSubmitted.set(true);
    }
  }
}
