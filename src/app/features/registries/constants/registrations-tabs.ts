import { TabOption } from '@osf/shared/models';

import { RegistrationTab } from '../enums';

export const REGISTRATIONS_TABS: TabOption[] = [
  {
    label: 'common.labels.drafts',
    value: RegistrationTab.Drafts,
  },
  {
    label: 'common.labels.submitted',
    value: RegistrationTab.Submitted,
  },
];
