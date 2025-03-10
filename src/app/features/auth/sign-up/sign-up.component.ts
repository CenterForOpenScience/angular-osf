import { Component, inject, OnInit } from '@angular/core';
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
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup = new FormGroup({});

  fb: FormBuilder = inject(FormBuilder);
  passwordRegex: RegExp = PASSWORD_REGEX;

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
        validators: passwordMatchValidator,
      },
    );
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      console.log('Form submitted:', this.signUpForm.value);
    } else {
      console.log('Form is invalid');
      Object.keys(this.signUpForm.controls).forEach((key) => {
        const control = this.signUpForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
