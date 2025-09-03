import { Observable } from 'rxjs';

import { AuthorizedAccountModel } from '@shared/models';

export interface AddonConfigActions {
  getAddons: () => Observable<void>;
  getAuthorizedAddons: () => AuthorizedAccountModel[];
}
