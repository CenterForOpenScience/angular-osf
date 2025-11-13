import { ProjectOverview } from '@osf/features/project/overview/models';
import { IdentifierModel } from '@osf/shared/models/identifiers/identifier.model';

export const MOCK_PROJECT_AFFILIATED_INSTITUTIONS = [
  {
    id: 'inst-1',
    type: 'institutions',
    name: 'University of Example',
    description: 'A leading research university',
    logo: 'https://example.com/logo1.png',
  },
  {
    id: 'inst-2',
    type: 'institutions',
    name: 'Research Institute',
    description: 'Focused on scientific research',
    logo: 'https://example.com/logo2.png',
  },
  {
    id: 'inst-3',
    type: 'institutions',
    name: 'Medical Center',
    description: 'Healthcare and medical research',
    logo: '',
  },
];

export const MOCK_PROJECT_IDENTIFIERS: IdentifierModel = {
  id: 'identifier-1',
  type: 'identifiers',
  category: 'doi',
  value: '10.1234/test.12345',
};

export const MOCK_PROJECT_OVERVIEW: ProjectOverview = {
  id: 'project-1',
  type: 'nodes',
  title: 'Test Project',
  description: 'Test Description',
  dateModified: '2023-01-01',
  dateCreated: '2023-01-01',
  isPublic: true,
  category: 'project',
  isRegistration: false,
  isPreprint: false,
  isFork: false,
  isCollection: false,
  tags: [],
  accessRequestsEnabled: false,
  analyticsKey: 'test-key',
  currentUserCanComment: true,
  currentUserPermissions: [],
  currentUserIsContributor: true,
  currentUserIsContributorOrGroupMember: true,
  wikiEnabled: false,
  contributors: [],
  customCitation: null,
  forksCount: 0,
  viewOnlyLinksCount: 0,
  links: {
    rootFolder: '/test',
    iri: 'https://test.com',
  },
  doi: MOCK_PROJECT_IDENTIFIERS.value,
};
