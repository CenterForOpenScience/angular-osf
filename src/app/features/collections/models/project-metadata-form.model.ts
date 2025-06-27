import { FormControl } from '@angular/forms';

import { ProjectMetadataFormControls } from '@osf/features/collections/enums';

export interface ProjectMetadataForm {
  [ProjectMetadataFormControls.Title]: FormControl<string>;
  [ProjectMetadataFormControls.Description]: FormControl<string>;
  [ProjectMetadataFormControls.License]: FormControl<string>;
  [ProjectMetadataFormControls.Tags]: FormControl<string[]>;
}
