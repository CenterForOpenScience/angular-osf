import { SelectOption } from '@shared/models';

import { ContactOption } from '../enums';

export const CONTACT_OPTIONS: SelectOption[] = [
  { label: 'adminInstitutions.contact.requestAccess', value: ContactOption.RequestAccess },
  { label: 'adminInstitutions.contact.sendMessage', value: ContactOption.SendMessage },
];
