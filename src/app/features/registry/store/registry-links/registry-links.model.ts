import { AsyncStateModel } from '@shared/models';

import { LinkedNode, LinkedRegistration, NodeBibliographicContributor } from '../../models';

export interface RegistryLinksStateModel {
  linkedNodes: AsyncStateModel<LinkedNode[]> & {
    meta?: { total: number; per_page: number };
  };
  linkedRegistrations: AsyncStateModel<LinkedRegistration[]> & {
    meta?: { total: number; per_page: number };
  };
  bibliographicContributors: AsyncStateModel<NodeBibliographicContributor[]> & {
    nodeId?: string;
  };
  bibliographicContributorsForRegistration: AsyncStateModel<NodeBibliographicContributor[]> & {
    registrationId?: string;
  };
}

export const REGISTRY_LINKS_STATE_DEFAULTS: RegistryLinksStateModel = {
  linkedNodes: { data: [], isLoading: false, error: null },
  linkedRegistrations: { data: [], isLoading: false, error: null },
  bibliographicContributors: { data: [], isLoading: false, error: null },
  bibliographicContributorsForRegistration: { data: [], isLoading: false, error: null },
};
