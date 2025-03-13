import { Component, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Password } from 'primeng/password';
import { RouterLink } from '@angular/router';
import {
  PASSWORD_REGEX,
  passwordMatchValidator,
} from '../sign-up/sign-up.helper';
import { PasswordInputHintComponent } from '@shared/components/password-input-hint/password-input-hint.component';

@Component({
  selector: 'osf-reset-password',
  standalone: true,
  imports: [
    Button,
    Password,
    ReactiveFormsModule,
    RouterLink,
    PasswordInputHintComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  passwordRegex: RegExp = PASSWORD_REGEX;
  resetPasswordForm: FormGroup = new FormGroup({});
  isFormSubmitted = signal(false);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.resetPasswordForm = this.fb.group(
      {
        password: [
          '',
          [Validators.required, Validators.pattern(this.passwordRegex)],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: passwordMatchValidator(),
      },
    );
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      // TODO: Implement password reset logic
      this.isFormSubmitted.set(true);
    }
  }
}
