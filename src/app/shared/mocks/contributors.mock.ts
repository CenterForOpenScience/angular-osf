import { ContributorModel } from '../models';

export const MOCK_CONTRIBUTOR: ContributorModel = {
  id: 'contributor-1',
  userId: 'user-1',
  type: 'user',
  fullName: 'John Doe',
  givenName: 'John Doe',
  familyName: 'John Doe',
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
  givenName: 'Jane Smith',
  familyName: 'Jane Smith',
  permission: 'write',
  isBibliographic: false,
  isCurator: true,
  education: [],
  employment: [],
};
