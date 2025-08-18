import { CustomOption } from '@shared/models';

import { AdminInstitutionResourceTab } from '../enums';

export const resourceTabOptions: CustomOption<AdminInstitutionResourceTab>[] = [
  { label: 'adminInstitutions.summary.title', value: AdminInstitutionResourceTab.Summary },
  { label: 'common.search.tabs.users', value: AdminInstitutionResourceTab.Users },
  { label: 'common.search.tabs.projects', value: AdminInstitutionResourceTab.Projects },
  { label: 'common.search.tabs.registrations', value: AdminInstitutionResourceTab.Registrations },
  { label: 'common.search.tabs.preprints', value: AdminInstitutionResourceTab.Preprints },
];
