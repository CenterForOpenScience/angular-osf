import { CustomOption } from '@osf/shared/models/select-option.model';

import { PreprintSubmissionsSort } from '../enums';

export const PREPRINT_SORT_OPTIONS: CustomOption<string>[] = [
  {
    value: PreprintSubmissionsSort.TitleAZ,
    label: 'moderation.sortOption.titleAZ',
  },
  {
    value: PreprintSubmissionsSort.TitleZA,
    label: 'moderation.sortOption.titleZA',
  },
  {
    value: PreprintSubmissionsSort.Newest,
    label: 'moderation.sortOption.newest',
  },
  {
    value: PreprintSubmissionsSort.Oldest,
    label: 'moderation.sortOption.oldest',
  },
];
