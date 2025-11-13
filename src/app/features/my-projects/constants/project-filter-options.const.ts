import { ResourceSearchMode } from '@osf/shared/enums/resource-search-mode.enum';
import { TabOption } from '@shared/models/tab-option.model';

export const PROJECT_FILTER_OPTIONS: TabOption[] = [
  {
    value: ResourceSearchMode.User,
    label: 'myProjects.tabOptions.all',
  },
  {
    value: ResourceSearchMode.Root,
    label: 'myProjects.tabOptions.root',
  },
  {
    value: ResourceSearchMode.Component,
    label: 'myProjects.tabOptions.component',
  },
];
