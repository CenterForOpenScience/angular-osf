import { CustomOption } from '@shared/models';

export const resourceTabOptions: CustomOption<string>[] = [
  { label: 'adminInstitutions.summary.title', value: 'summary' },
  { label: 'common.search.tabs.users', value: 'users' },
  { label: 'common.search.tabs.projects', value: 'projects' },
  { label: 'common.search.tabs.registrations', value: 'registrations' },
  { label: 'common.search.tabs.preprints', value: 'preprints' },
];
