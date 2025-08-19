import { ContributorModel } from '@shared/models';

export const MOCK_CONTRIBUTOR: ContributorModel = {
  id: 'contributor-1',
  userId: 'user-1',
  type: 'user',
  fullName: 'John Doe',
  permission: 'read',
  isBibliographic: true,
  isCurator: false,
  education: [],
  employment: [],
};

export const MOCK_CONTRIBUTOR_WITHOUT_HISTORY: ContributorModel = {
  id: 'contributor-2',
  userId: 'user-2',
  type: 'user',
  fullName: 'Jane Smith',
  permission: 'write',
  isBibliographic: false,
  isCurator: true,
  education: [],
  employment: [],
};
