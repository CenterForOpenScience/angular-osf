import { FormControl } from '@angular/forms';

export interface ComponentForm {
  title: FormControl<string>;
  affiliations: FormControl<string[]>;
  storageLocation: FormControl<string>;
  description: FormControl<string>;
  addContributors: FormControl<boolean>;
  addTags: FormControl<boolean>;
}
