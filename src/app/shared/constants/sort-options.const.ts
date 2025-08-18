import { SortType } from '../enums';
import { CustomOption } from '../models';

export const ALL_SORT_OPTIONS: CustomOption<string>[] = [
  {
    value: SortType.NameAZ,
    label: 'files.sort.nameAZ',
  },
  {
    value: SortType.NameZA,
    label: 'files.sort.nameZA',
  },
  {
    value: SortType.LastModifiedOldest,
    label: 'files.sort.lastModifiedOldest',
  },
  {
    value: SortType.LastModifiedNewest,
    label: 'files.sort.lastModifiedNewest',
  },
];

export const COLLECTION_SUBMISSIONS_SORT_OPTIONS: CustomOption<string>[] = [
  {
    value: SortType.LastModifiedNewest,
    label: 'files.sort.lastModifiedNewest',
  },
  {
    value: SortType.LastModifiedOldest,
    label: 'files.sort.lastModifiedOldest',
  },
  {
    value: SortType.TitleAZ,
    label: 'files.sort.nameAZ',
  },
  {
    value: SortType.TitleZA,
    label: 'files.sort.nameZA',
  },
];
