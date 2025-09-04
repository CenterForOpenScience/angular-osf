import { AsyncStateWithTotalCount } from '@shared/models';

import { RegistryComponentModel } from '../../models';

export interface RegistryComponentsStateModel {
  registryComponents: AsyncStateWithTotalCount<RegistryComponentModel[]>;
}

export const REGISTRY_COMPONENTS_STATE_DEFAULTS: RegistryComponentsStateModel = {
  registryComponents: { data: [], isLoading: false, error: null, totalCount: 0 },
};
