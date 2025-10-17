import { ContributorPermission } from '@shared/enums';

import { ContributorModel } from '../../app/shared/models';

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
