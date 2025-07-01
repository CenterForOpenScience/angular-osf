import { FormControl } from '@angular/forms';

export interface LicenseForm {
  copyrightHolders: FormControl<string>;
  year: FormControl<string>;
}
