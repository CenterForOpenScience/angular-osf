import { Observable } from 'rxjs';

import { AuthorizedAccount } from '@shared/models';

export interface AddonConfigActions {
  getAddons: () => Observable<void>;
  getAuthorizedAddons: () => AuthorizedAccount[];
}
