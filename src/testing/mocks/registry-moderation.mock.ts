import { RegistryModeration } from '@osf/features/moderation/models';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';

export const MOCK_REGISTRY_MODERATIONS: RegistryModeration[] = [
  {
    id: '1',
    title: 'Test Registry 1',
    revisionStatus: RevisionReviewStates.RevisionPendingModeration,
    reviewsState: RegistrationReviewStates.Pending,
    public: false,
    embargoed: false,
    embargoEndDate: null,
    actions: [
      {
        id: '1',
        trigger: 'manual',
        fromState: 'pending',
        toState: 'pending',
        dateModified: '2023-01-01',
        creator: {
          id: 'user-1',
          name: 'John Doe',
        },
        comment: 'Registry submission',
      },
    ],
    revisionId: 'revision-1',
  },
  {
    id: '2',
    title: 'Test Registry 2',
    revisionStatus: RevisionReviewStates.Approved,
    reviewsState: RegistrationReviewStates.Accepted,
    public: true,
    embargoed: false,
    embargoEndDate: null,
    actions: [
      {
        id: '2',
        trigger: 'manual',
        fromState: 'pending',
        toState: 'accepted',
        dateModified: '2023-01-02',
        creator: {
          id: 'user-2',
          name: 'Jane Doe',
        },
        comment: 'Registry approved',
      },
    ],
    revisionId: 'revision-2',
  },
  {
    id: '3',
    title: 'Test Registry 3',
    revisionStatus: RevisionReviewStates.Unapproved,
    reviewsState: RegistrationReviewStates.Rejected,
    public: false,
    embargoed: true,
    embargoEndDate: '2024-01-01',
    actions: [
      {
        id: '3',
        trigger: 'manual',
        fromState: 'pending',
        toState: 'rejected',
        dateModified: '2023-01-03',
        creator: {
          id: 'user-3',
          name: 'Bob Smith',
        },
        comment: 'Registry rejected',
      },
    ],
    revisionId: 'revision-3',
  },
];
