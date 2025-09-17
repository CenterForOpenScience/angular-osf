import { AsyncStateModel } from '@shared/models';

import { LinkedNode, LinkedRegistration } from '../../models';

export interface RegistryLinksStateModel {
  linkedNodes: AsyncStateModel<LinkedNode[]> & {
    meta?: { total: number; per_page: number };
  };
  linkedRegistrations: AsyncStateModel<LinkedRegistration[]> & {
    meta?: { total: number; per_page: number };
  };
}

export const REGISTRY_LINKS_STATE_DEFAULTS: RegistryLinksStateModel = {
  linkedNodes: { data: [], isLoading: false, error: null },
  linkedRegistrations: { data: [], isLoading: false, error: null },
};
