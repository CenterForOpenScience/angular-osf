import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RegistryStatus } from '@osf/shared/enums/registry-status.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { RegistrationCard } from '@shared/models/registration/registration-card.model';

import { MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY } from './contributors.mock';

export const MOCK_REGISTRATION: RegistrationCard = {
  id: 'reg-123',
  title: 'Test Registration',
  description: 'This is a test registration',
  status: RegistryStatus.Pending,
  dateCreated: '2024-01-15T10:00:00Z',
  dateModified: '2024-01-20T14:30:00Z',
  contributors: [MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY],
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
  currentUserPermissions: [UserPermissions.Admin, UserPermissions.Write, UserPermissions.Read],
};
