import { FormControl } from '@angular/forms';

export interface ResourceInformationForm {
  resourceType: FormControl<string>;
  resourceLanguage: FormControl<string>;
}
