import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';
import { SelectOption } from '@osf/shared/models/select-option.model';

export const PERMISSION_OPTIONS: SelectOption[] = [
  {
    label: 'project.contributors.permissions.administrator',
    value: ContributorPermission.Admin,
  },
  {
    label: 'project.contributors.permissions.readAndWrite',
    value: ContributorPermission.Write,
  },
  {
    label: 'project.contributors.permissions.read',
    value: ContributorPermission.Read,
  },
];

export const BIBLIOGRAPHY_OPTIONS: SelectOption[] = [
  {
    label: 'project.contributors.bibliography.bibliographic',
    value: true,
  },
  {
    label: 'project.contributors.bibliography.nonBibliographic',
    value: false,
  },
];
