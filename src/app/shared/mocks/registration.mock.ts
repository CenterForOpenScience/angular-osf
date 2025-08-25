import { RegistrationReviewStates, RegistryStatus, RevisionReviewStates } from '@shared/enums';
import { RegistrationCard } from '@shared/models';

export const MOCK_REGISTRATION: RegistrationCard = {
  id: 'reg-123',
  title: 'Test Registration',
  description: 'This is a test registration',
  status: RegistryStatus.Pending,
  dateCreated: '2024-01-15T10:00:00Z',
  dateModified: '2024-01-20T14:30:00Z',
  contributors: [
    { fullName: 'John Doe', id: 'user1' },
    { fullName: 'Jane Smith', id: 'user2' },
  ],
  registrationTemplate: 'Test Template',
  registry: 'Test Registry',
  public: true,
  reviewsState: RegistrationReviewStates.Accepted,
  revisionState: RevisionReviewStates.Approved,
  hasData: true,
  hasAnalyticCode: false,
  hasMaterials: true,
  hasPapers: false,
  hasSupplements: true,
};
