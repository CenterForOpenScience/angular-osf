import { LinkedRegistration } from '@osf/features/registry/models/linked-nodes.model';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';

export const createMockLinkedRegistration = (overrides?: Partial<LinkedRegistration>): LinkedRegistration => ({
  id: 'registration-123',
  title: 'Test Registration',
  description: 'Test description',
  category: 'project',
  dateCreated: '2024-01-01T00:00:00Z',
  dateModified: '2024-01-02T00:00:00Z',
  tags: ['tag1', 'tag2'],
  isPublic: true,
  reviewsState: RegistrationReviewStates.Accepted,
  contributors: [],
  currentUserPermissions: ['read', 'write'],
  hasData: true,
  hasAnalyticCode: false,
  hasMaterials: true,
  hasPapers: false,
  hasSupplements: true,
  registrationSupplement: 'supplement-123',
  ...overrides,
});
