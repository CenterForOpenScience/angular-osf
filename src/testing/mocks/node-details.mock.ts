import { NodeDetailsModel } from '@osf/features/project/settings/models';

export const MOCK_NODE_DETAILS: NodeDetailsModel = {
  id: 'test-project-1',
  title: 'Test Project',
  description: 'A test project description',
  isPublic: true,
  region: { id: 'us-east-1', name: 'US East' },
  affiliatedInstitutions: [],
  lastFetched: Date.now(),
};
