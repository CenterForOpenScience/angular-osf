import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

import { LinkedNode, LinkedRegistration } from '../../models';

export interface RegistryLinksStateModel {
  linkedNodes: AsyncStateWithTotalCount<LinkedNode[]>;
  linkedRegistrations: AsyncStateWithTotalCount<LinkedRegistration[]>;
}

export const REGISTRY_LINKS_STATE_DEFAULTS: RegistryLinksStateModel = {
  linkedNodes: { data: [], isLoading: false, error: null, totalCount: 0 },
  linkedRegistrations: { data: [], isLoading: false, error: null, totalCount: 0 },
};
