import { AbstractControl, FormGroup } from '@angular/forms';

export class FormValidationHelper {
  static hasError(control: AbstractControl | null, errorType: string): boolean {
    return control?.errors?.[errorType] && control?.touched === true;
  }

  static getErrorClass(control: AbstractControl | null, formErrors?: Record<string, boolean>): string {
    const hasControlError = control?.invalid && control?.touched;
    const hasFormError = formErrors && Object.values(formErrors).some((error) => error);

    return hasControlError || hasFormError ? 'ng-invalid ng-dirty' : '';
  }

  static getFormControl(form: FormGroup, controlName: string): AbstractControl | null {
    return form.get(controlName);
  }

  static isFieldTouched(control: AbstractControl | null): boolean {
    return control?.touched === true;
  }

  static isFieldInvalid(control: AbstractControl | null): boolean {
    return control?.invalid === true;
  }
}
