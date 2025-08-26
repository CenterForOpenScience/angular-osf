import { Observable } from 'rxjs';

import { AuthorizedStorageAccountModel } from '@shared/models';

export interface AddonConfigActions {
  getAddons: () => Observable<void>;
  getAuthorizedAddons: () => AuthorizedStorageAccountModel[];
}
