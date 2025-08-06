import { FormControl } from '@angular/forms';

export interface SignUpForm {
  fullName: FormControl<string>;
  email1: FormControl<string>;
  email2: FormControl<string>;
  password: FormControl<string>;
  acceptedTermsOfService: FormControl<boolean>;
  recaptcha: FormControl<string>;
}
