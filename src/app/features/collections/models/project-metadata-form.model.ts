import { FormControl } from '@angular/forms';

import { ProjectMetadataFormControls } from '@osf/features/collections/enums';
import { LicenseModel } from '@shared/models';

export interface ProjectMetadataForm {
  [ProjectMetadataFormControls.Title]: FormControl<string>;
  [ProjectMetadataFormControls.Description]: FormControl<string>;
  [ProjectMetadataFormControls.License]: FormControl<LicenseModel | null>;
  [ProjectMetadataFormControls.Tags]: FormControl<string[]>;
  [ProjectMetadataFormControls.LicenseYear]: FormControl<string>;
  [ProjectMetadataFormControls.CopyrightHolders]: FormControl<string>;
}
