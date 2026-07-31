import { ResourceVisibilityFilter } from '@osf/shared/enums/resource-visibility-filter.enum';
import { TabOption } from '@osf/shared/models/tab-option.model';

export const VISIBILITY_FILTER_OPTIONS: TabOption[] = [
  {
    value: ResourceVisibilityFilter.All,
    label: 'myProjects.visibilityFilterOptions.all',
  },
  {
    value: ResourceVisibilityFilter.Public,
    label: 'myProjects.visibilityFilterOptions.public',
  },
  {
    value: ResourceVisibilityFilter.Private,
    label: 'myProjects.visibilityFilterOptions.private',
  },
];
