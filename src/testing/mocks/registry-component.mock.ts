import { RegistryComponentModel } from '@osf/features/registry/models';

export const createMockRegistryComponent = (overrides?: Partial<RegistryComponentModel>): RegistryComponentModel => ({
  id: 'component-123',
  title: 'Test Component',
  description: 'Test component description',
  category: 'project',
  dateCreated: '2024-01-01T00:00:00Z',
  dateModified: '2024-01-02T00:00:00Z',
  dateRegistered: '2024-01-03T00:00:00Z',
  registrationSupplement: 'supplement-456',
  tags: ['tag1', 'tag2'],
  isPublic: true,
  contributors: [],
  registry: 'test-registry',
  ...overrides,
});
