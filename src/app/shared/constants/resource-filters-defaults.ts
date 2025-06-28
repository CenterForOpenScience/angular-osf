import { FilterLabelsModel } from '@shared/models';

export const resourceFiltersDefaults = {
  creator: {
    filterName: FilterLabelsModel.creator,
    label: undefined,
    value: undefined,
  },
  dateCreated: {
    filterName: FilterLabelsModel.dateCreated,
    label: undefined,
    value: undefined,
  },
  funder: {
    filterName: FilterLabelsModel.funder,
    label: undefined,
    value: undefined,
  },
  subject: {
    filterName: FilterLabelsModel.subject,
    label: undefined,
    value: undefined,
  },
  license: {
    filterName: FilterLabelsModel.license,
    label: undefined,
    value: undefined,
  },
  resourceType: {
    filterName: FilterLabelsModel.resourceType,
    label: undefined,
    value: undefined,
  },
  institution: {
    filterName: FilterLabelsModel.institution,
    label: undefined,
    value: undefined,
  },
  provider: {
    filterName: FilterLabelsModel.provider,
    label: undefined,
    value: undefined,
  },
  partOfCollection: {
    filterName: FilterLabelsModel.partOfCollection,
    label: undefined,
    value: undefined,
  },
};

// this.loadRequests.next({
//   type: GetResourcesRequestTypeEnum.GetResources,
//   filters: {
//     institution: response.iris.join(','),
//   },
// });
