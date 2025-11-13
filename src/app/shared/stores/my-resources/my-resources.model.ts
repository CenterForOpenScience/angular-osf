import { MyResourcesItem } from '@osf/shared/models/my-resources/my-resources.models';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

export interface MyResourcesStateModel {
  projects: AsyncStateWithTotalCount<MyResourcesItem[]>;
  registrations: AsyncStateWithTotalCount<MyResourcesItem[]>;
  preprints: AsyncStateWithTotalCount<MyResourcesItem[]>;
}

export const MY_RESOURCES_STATE_DEFAULTS: MyResourcesStateModel = {
  projects: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  registrations: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  preprints: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
