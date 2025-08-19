import { ResourceTab } from '@shared/enums';
import { AsyncStateModel, Institution, Resource } from '@shared/models';
import { BaseSearchStateModel } from '@shared/stores/base-search';

export interface InstitutionsSearchModel extends BaseSearchStateModel {
  institution: AsyncStateModel<Institution>;
  resources: AsyncStateModel<Resource[]>;
  filterValues: Record<string, string | null>;
  providerIri: string;
  resourceType: ResourceTab;
}
