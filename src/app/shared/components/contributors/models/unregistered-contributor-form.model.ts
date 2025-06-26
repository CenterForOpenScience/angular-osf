import { FormControl } from '@angular/forms';

export interface UnregisteredContributorForm {
  fullName: FormControl<string>;
  email: FormControl<string>;
}
