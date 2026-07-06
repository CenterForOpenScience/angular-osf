import { DiscoverableFilter, FilterOperatorOption } from '@osf/shared/models/search/discoverable-filter.model';
import { ResourcesData } from '@shared/models/search/resource.model';

export const MOCK_RESOURCES_DATA: ResourcesData = {
  resources: [],
  filters: [],
  count: 0,
  first: null,
  next: null,
  previous: null,
};

export const MOCK_CEDAR_FILTER: DiscoverableFilter = {
  key: 'School Type',
  label: 'School Type',
  operator: FilterOperatorOption.AnyOf,
  cedarPropertyIri: 'uuid-school-type',
  options: [
    { label: 'High School', value: 'High School', cardSearchResultCount: null },
    { label: 'Middle School', value: 'Middle School', cardSearchResultCount: null },
  ],
};

export const MOCK_REGULAR_FILTER: DiscoverableFilter = {
  key: 'subject',
  label: 'Subject',
  operator: FilterOperatorOption.AnyOf,
  resultCount: 10,
};
