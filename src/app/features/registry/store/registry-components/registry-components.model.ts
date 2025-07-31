import { AsyncStateWithTotalCount } from '@shared/models';

import { RegistryComponentModel } from '../../models';

export interface RegistryComponentsStateModel {
  registryComponents: AsyncStateWithTotalCount<RegistryComponentModel[]>;
}
