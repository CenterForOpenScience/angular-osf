import { Observable } from 'rxjs';

import { AuthorizedAccountModel } from '@osf/shared/models/addons/authorized-account.model';

export type AddonConfigMap = Record<string, AddonConfigActions>;

interface AddonConfigActions {
  getAddons: () => Observable<void>;
  getAuthorizedAddons: () => AuthorizedAccountModel[];
}
