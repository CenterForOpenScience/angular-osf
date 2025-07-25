import { CustomOption } from '@osf/shared/models';

import { RegistrySort } from '../enums';

export const REGISTRY_SORT_OPTIONS: CustomOption<string>[] = [
  {
    value: RegistrySort.TitleAZ,
    label: 'moderation.registrySortOption.titleAZ',
  },
  {
    value: RegistrySort.TitleZA,
    label: 'moderation.registrySortOption.titleZA',
  },
  {
    value: RegistrySort.RegisteredNewest,
    label: 'moderation.registrySortOption.registeredOldest',
  },
  {
    value: RegistrySort.RegisteredOldest,
    label: 'moderation.registrySortOption.registeredNewest',
  },
];
