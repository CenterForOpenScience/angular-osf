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
