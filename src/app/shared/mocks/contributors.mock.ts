import { ProjectOverviewContributor } from '@osf/features/project/overview/models';
import { ContributorModel } from '@shared/models';

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

export const MOCK_OVERVIEW_CONTRIBUTORS: ProjectOverviewContributor[] = [
  {
    id: MOCK_CONTRIBUTOR.id,
    type: MOCK_CONTRIBUTOR.type,
    familyName: 'Doe',
    fullName: MOCK_CONTRIBUTOR.fullName,
    givenName: 'John',
    middleName: '',
  },
];
