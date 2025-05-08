import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function linkValidator(): ValidatorFn {
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
