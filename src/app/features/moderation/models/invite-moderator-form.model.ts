import { FormControl } from '@angular/forms';

import { ModeratorPermission } from '../enums';

export interface InviteModeratorForm {
  fullName: FormControl<string>;
  email: FormControl<string>;
  permission: FormControl<ModeratorPermission>;
}
