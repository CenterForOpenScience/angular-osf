import { ResourceTab } from '../enums';
import { TabOption } from '../models';

export const SEARCH_TAB_OPTIONS: TabOption[] = [
  { label: 'common.search.tabs.all', value: ResourceTab.All },
  { label: 'common.search.tabs.files', value: ResourceTab.Files },
  { label: 'common.search.tabs.preprints', value: ResourceTab.Preprints },
  { label: 'common.search.tabs.projects', value: ResourceTab.Projects },
  { label: 'common.search.tabs.registrations', value: ResourceTab.Registrations },
  { label: 'common.search.tabs.users', value: ResourceTab.Users },
];
