import { FormControl } from '@angular/forms';

import { ProjectFormControls } from '@shared/entities/create-project-form-controls.enum';

export interface ProjectForm {
  [ProjectFormControls.Title]: FormControl<string>;
  [ProjectFormControls.StorageLocation]: FormControl<string>;
  [ProjectFormControls.Affiliations]: FormControl<string[]>;
  [ProjectFormControls.Description]: FormControl<string>;
  [ProjectFormControls.Template]: FormControl<string>;
}
