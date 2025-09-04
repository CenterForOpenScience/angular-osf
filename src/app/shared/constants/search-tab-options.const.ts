import { ResourceType } from '../enums';
import { TabOption } from '../models';

export const SEARCH_TAB_OPTIONS: TabOption[] = [
  { label: 'common.search.tabs.all', value: ResourceType.Null },
  { label: 'common.search.tabs.projects', value: ResourceType.Project },
  { label: 'common.search.tabs.registrations', value: ResourceType.Registration },
  { label: 'common.search.tabs.preprints', value: ResourceType.Preprint },
  { label: 'common.search.tabs.files', value: ResourceType.File },
  { label: 'common.search.tabs.users', value: ResourceType.Agent },
];
