import { Observable } from 'rxjs';

import { AuthorizedAccountModel } from '@osf/shared/models/addons/authorized-account.model';

export interface AddonConfigActions {
  getAddons: () => Observable<void>;
  getAuthorizedAddons: () => AuthorizedAccountModel[];
}
