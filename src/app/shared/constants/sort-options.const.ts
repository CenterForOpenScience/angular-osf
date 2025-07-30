import { SortType } from '../enums';
import { CustomOption } from '../models';

export const ALL_SORT_OPTIONS: CustomOption<string>[] = [
  {
    value: SortType.NameAZ,
    label: 'project.files.sort.nameAZ',
  },
  {
    value: SortType.NameZA,
    label: 'project.files.sort.nameZA',
  },
  {
    value: SortType.LastModifiedOldest,
    label: 'project.files.sort.lastModifiedOldest',
  },
  {
    value: SortType.LastModifiedNewest,
    label: 'project.files.sort.lastModifiedNewest',
  },
];

export const COLLECTION_SUBMISSIONS_SORT_OPTIONS: CustomOption<string>[] = [
  {
    value: SortType.LastModifiedNewest,
    label: 'project.files.sort.lastModifiedNewest',
  },
  {
    value: SortType.LastModifiedOldest,
    label: 'project.files.sort.lastModifiedOldest',
  },
  {
    value: SortType.TitleAZ,
    label: 'project.files.sort.nameAZ',
  },
  {
    value: SortType.TitleZA,
    label: 'project.files.sort.nameZA',
  },
];
