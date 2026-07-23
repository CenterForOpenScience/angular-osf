import { FormControl } from '@angular/forms';

import { LicenseModel } from '@osf/shared/models/license/license.model';

import { ProjectMetadataFormControls } from '../enums';

export interface ProjectMetadataForm {
  [ProjectMetadataFormControls.Title]: FormControl<string>;
  [ProjectMetadataFormControls.Description]: FormControl<string>;
  [ProjectMetadataFormControls.License]: FormControl<LicenseModel | null>;
  [ProjectMetadataFormControls.Tags]: FormControl<string[]>;
  [ProjectMetadataFormControls.LicenseYear]: FormControl<string>;
  [ProjectMetadataFormControls.CopyrightHolders]: FormControl<string>;
}
