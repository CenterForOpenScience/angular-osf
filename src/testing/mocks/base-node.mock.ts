import { BaseNodeModel } from '@shared/models/nodes/base-node.model';

export const testNode: BaseNodeModel = {
  id: 'abc123',
  title: 'Long-Term Effects of Climate Change',
  description:
    'This project collects and analyzes climate change data across multiple regions to understand long-term environmental impacts.',
  category: 'project',
  customCitation: 'Doe, J. (2024). Long-Term Effects of Climate Change. OSF.',
  dateCreated: '2024-05-10T14:23:00Z',
  dateModified: '2025-09-01T09:45:00Z',
  isRegistration: false,
  isPreprint: true,
  isFork: false,
  isCollection: false,
  isPublic: true,
  tags: ['climate', 'environment', 'data-analysis'],
  accessRequestsEnabled: true,
  nodeLicense: {
    copyrightHolders: ['CC0 1.0 Universal'],
    year: '2025',
  },
  currentUserPermissions: ['admin', 'read', 'write'],
  currentUserIsContributor: true,
  wikiEnabled: true,
  rootParentId: 'nt29k',
  type: 'project',
  parent: undefined,
};
