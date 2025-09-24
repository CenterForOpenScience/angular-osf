import { FormControl } from '@angular/forms';

export interface ResourceInformationForm {
  resourceType: FormControl<string | null>;
  resourceLanguage: FormControl<string | null>;
}
