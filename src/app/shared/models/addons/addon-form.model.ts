import { FormControl } from '@angular/forms';

import { AddonFormControls } from '@shared/enums';

export interface AddonForm {
  [AddonFormControls.AccessKey]?: FormControl<string | null>;
  [AddonFormControls.SecretKey]?: FormControl<string | null>;
  [AddonFormControls.HostUrl]?: FormControl<string | null>;
  [AddonFormControls.Username]?: FormControl<string | null>;
  [AddonFormControls.Password]?: FormControl<string | null>;
  [AddonFormControls.PersonalAccessToken]?: FormControl<string | null>;
  [AddonFormControls.AccountName]: FormControl<string | null>;
  [AddonFormControls.ApiToken]?: FormControl<string | null>;
}
