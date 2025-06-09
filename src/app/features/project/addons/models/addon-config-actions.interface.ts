import { Observable } from 'rxjs';

import { AuthorizedAddon } from '@shared/models';

export interface AddonConfigActions {
  getAddons: () => Observable<void>;
  getAuthorizedAddons: () => AuthorizedAddon[];
}
