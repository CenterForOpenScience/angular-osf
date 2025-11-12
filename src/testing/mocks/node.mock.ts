import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';

export const MOCK_NODE_WITH_ADMIN: NodeModel = {
  id: 'test-id-1',
  type: 'nodes',
  title: 'Test Component',
  description: 'Test Description',
  category: 'project',
  dateCreated: '2024-01-01T00:00:00.000Z',
  dateModified: '2024-01-02T00:00:00.000Z',
  isRegistration: false,
  isPreprint: false,
  isFork: false,
  isCollection: false,
  isPublic: true,
  tags: [],
  accessRequestsEnabled: true,
  nodeLicense: {
    copyrightHolders: null,
    year: null,
  },
  currentUserPermissions: [UserPermissions.Admin],
  currentUserIsContributor: true,
  wikiEnabled: true,
  bibliographicContributors: [],
};

export const MOCK_NODE_WITHOUT_ADMIN: NodeModel = {
  id: 'test-id-2',
  type: 'nodes',
  title: 'Test Component 2',
  description: 'Test Description 2',
  category: 'project',
  dateCreated: '2024-01-01T00:00:00.000Z',
  dateModified: '2024-01-02T00:00:00.000Z',
  isRegistration: false,
  isPreprint: false,
  isFork: false,
  isCollection: false,
  isPublic: false,
  tags: [],
  accessRequestsEnabled: true,
  nodeLicense: {
    copyrightHolders: null,
    year: null,
  },
  currentUserPermissions: [UserPermissions.Read, UserPermissions.Write],
  currentUserIsContributor: true,
  wikiEnabled: true,
  bibliographicContributors: [],
};
