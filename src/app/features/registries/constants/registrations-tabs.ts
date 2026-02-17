import { CustomOption } from '@osf/shared/models/select-option.model';

import { RegistrationTab } from '../enums';

export const REGISTRATIONS_TABS: CustomOption<string>[] = [
  {
    label: 'common.labels.drafts',
    value: RegistrationTab.Drafts,
  },
  {
    label: 'common.labels.submitted',
    value: RegistrationTab.Submitted,
  },
];
