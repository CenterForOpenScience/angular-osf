import { ResourceSearchMode } from '@osf/shared/enums';
import { TabOption } from '@osf/shared/models';

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
