import { ResourceTab } from '@osf/shared/enums';
import { AsyncStateModel, Resource } from '@osf/shared/models';
import { BaseSearchStateModel } from '@shared/stores/base-search';

export interface SearchStateModel extends BaseSearchStateModel {
  resources: AsyncStateModel<Resource[]>;
  filterValues: Record<string, string | null>;
  resourceTab: ResourceTab;
  isMyProfile: boolean;
}
