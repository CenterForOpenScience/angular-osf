import { TabOption } from '@osf/shared/models';

import { MyProjectsTab } from '../enums';

export const MY_PROJECTS_TABS: TabOption[] = [
  {
    value: MyProjectsTab.Projects,
    label: 'myProjects.tabs.myProjects',
  },
  {
    value: MyProjectsTab.Registrations,
    label: 'myProjects.tabs.myRegistrations',
  },
  {
    value: MyProjectsTab.Preprints,
    label: 'myProjects.tabs.myPreprints',
  },
  {
    value: MyProjectsTab.Bookmarks,
    label: 'myProjects.tabs.bookmarks',
  },
];
