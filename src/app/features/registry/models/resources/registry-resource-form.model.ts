import { FormControl } from '@angular/forms';

export interface RegistryResourceFormModel {
  pid: FormControl<string | null>;
  resourceType: FormControl<string | null>;
  description: FormControl<string | null>;
}
