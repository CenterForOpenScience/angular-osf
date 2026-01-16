import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';
import { ComponentCheckboxItemModel } from '@osf/shared/models/component-checkbox-item.model';
import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';
import { ContributorAddModel } from '@osf/shared/models/contributors/contributor-add.model';

export const MOCK_CONTRIBUTOR: ContributorModel = {
  id: 'contributor-1',
  userId: 'user-1',
  type: 'user',
  fullName: 'John Doe',
  givenName: 'John Doe',
  familyName: 'John Doe',
  isUnregisteredContributor: false,
  permission: ContributorPermission.Read,
  isBibliographic: true,
  isCurator: false,
  index: 0,
  education: [],
  employment: [],
  deactivated: false,
};

export const MOCK_CONTRIBUTOR_WITHOUT_HISTORY: ContributorModel = {
  id: 'contributor-2',
  userId: 'user-2',
  type: 'user',
  fullName: 'Jane Smith',
  givenName: 'Jane Smith',
  familyName: 'Jane Smith',
  isUnregisteredContributor: false,
  permission: ContributorPermission.Write,
  isBibliographic: false,
  isCurator: true,
  index: 0,
  education: [],
  employment: [],
  deactivated: false,
};

export const MOCK_CONTRIBUTOR_ADD: ContributorAddModel = {
  id: 'user-1',
  fullName: 'John Doe',
  isBibliographic: true,
  permission: 'read',
  checked: true,
  disabled: false,
};

export const MOCK_CONTRIBUTOR_ADD_DISABLED: ContributorAddModel = {
  id: 'user-2',
  fullName: 'Jane Smith',
  isBibliographic: false,
  permission: 'write',
  checked: true,
  disabled: true,
};

export const MOCK_CONTRIBUTOR_ADD_UNCHECKED: ContributorAddModel = {
  id: 'user-3',
  fullName: 'Bob Johnson',
  isBibliographic: true,
  permission: 'admin',
  checked: false,
  disabled: false,
};

export const MOCK_COMPONENT_CHECKBOX_ITEM: ComponentCheckboxItemModel = {
  id: 'component-1',
  title: 'Component 1',
  isCurrent: false,
  disabled: false,
  checked: true,
  parentId: null,
};

export const MOCK_COMPONENT_CHECKBOX_ITEM_CURRENT: ComponentCheckboxItemModel = {
  id: 'component-2',
  title: 'Component 2',
  isCurrent: true,
  disabled: false,
  checked: false,
  parentId: 'parent-1',
};

export const MOCK_COMPONENT_CHECKBOX_ITEM_UNCHECKED: ComponentCheckboxItemModel = {
  id: 'component-3',
  title: 'Component 3',
  isCurrent: false,
  disabled: false,
  checked: false,
  parentId: null,
};
