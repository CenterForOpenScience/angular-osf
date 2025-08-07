import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static requiredTrimmed(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
        return { required: true };
      }

      return null;
    };
  }

  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isValid = emailRegex.test(control.value);

      return isValid ? null : { email: { value: control.value } };
    };
  }

  static linkValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const urlPattern = /^(https):\/\/.+/i;

      const isValid = urlPattern.test(value);

      return isValid ? null : { link: true };
    };
  }

  static requiredArrayValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!Array.isArray(value) || !value.length) {
        return { required: true };
      }
      return null;
    };
  }

  static dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('startDate')?.value;
    const end = control.get('endDate')?.value;

    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return endDate > startDate ? null : { dateRangeInvalid: true };
  };

  static doiValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const DOIRegex = /\b(10\.\d{4,}(?:\.\d+)*\/\S+(?:(?!["&'<>])\S))\b/;
    const isValid = DOIRegex.test(value);
    return isValid ? null : { invalidDoi: true };
  };

  static passwordMatchValidator(passwordField = 'password', confirmPasswordField = 'confirmPassword'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      const passwordValue = password.value;
      const confirmPasswordValue = confirmPassword.value;

      if (!passwordValue || !confirmPasswordValue) {
        return null;
      }

      if (passwordValue !== confirmPasswordValue) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }
}
