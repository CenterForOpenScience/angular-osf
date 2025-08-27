import { FormControl } from '@angular/forms';

export interface RedirectLinkForm {
  isEnabled: FormControl<boolean>;
  url: FormControl<string | null>;
  label: FormControl<string | null>;
}
