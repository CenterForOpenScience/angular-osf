import { LinkedNode } from '@osf/features/registry/models';

export const createMockLinkedNode = (overrides?: Partial<LinkedNode>): LinkedNode => ({
  id: 'node-123',
  title: 'Test Node',
  description: 'Test node description',
  category: 'project',
  dateCreated: '2024-01-01T00:00:00Z',
  dateModified: '2024-01-02T00:00:00Z',
  tags: ['tag1'],
  isPublic: false,
  contributors: [],
  htmlUrl: 'https://example.com/node',
  apiUrl: 'https://api.example.com/node',
  ...overrides,
});
