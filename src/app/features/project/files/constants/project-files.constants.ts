import { FileMenuItems, FilesSorting } from '../models';

export const FILE_MENU_ITEMS = [
  { label: FileMenuItems.Download },
  { label: FileMenuItems.Copy },
  { label: FileMenuItems.Move },
  { label: FileMenuItems.Delete },
  { label: FileMenuItems.Rename },
];

export const FILE_SORT_OPTIONS = [
  {
    value: FilesSorting.NameAZ,
    label: 'Name: A-Z',
  },
  {
    value: FilesSorting.NameZA,
    label: 'Name: Z-A',
  },
  {
    value: FilesSorting.LastModifiedOldest,
    label: 'Last modified: oldest to newest',
  },
  {
    value: FilesSorting.LastModifiedNewest,
    label: 'Last modified: newest to oldest',
  },
];
