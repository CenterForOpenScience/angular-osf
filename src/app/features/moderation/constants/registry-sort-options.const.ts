import { CustomOption } from '@osf/shared/models';

import { RegistrySort } from '../enums';

export const REGISTRY_SORT_OPTIONS: CustomOption<string>[] = [
  {
    value: RegistrySort.TitleAZ,
    label: 'moderation.sortOption.titleAZ',
  },
  {
    value: RegistrySort.TitleZA,
    label: 'moderation.sortOption.titleZA',
  },
  {
    value: RegistrySort.RegisteredNewest,
    label: 'moderation.sortOption.newest',
  },
  {
    value: RegistrySort.RegisteredOldest,
    label: 'moderation.sortOption.oldest',
  },
];
