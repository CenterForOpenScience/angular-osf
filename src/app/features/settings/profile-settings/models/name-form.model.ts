import { FormControl } from '@angular/forms';

export interface NameForm {
  fullName: FormControl<string>;
  givenName: FormControl<string>;
  middleNames: FormControl<string>;
  familyName: FormControl<string>;
  suffix: FormControl<string>;
}
