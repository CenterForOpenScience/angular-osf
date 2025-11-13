import { PreprintSubmissionModel } from '@osf/features/moderation/models';

export const MOCK_PREPRINT_SUBMISSIONS: PreprintSubmissionModel[] = [
  {
    id: '1',
    title: 'Test Preprint Submission 1',
    reviewsState: 'pending',
    public: false,
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
        comment: 'Test comment',
      },
    ],
    contributors: [],
    totalContributors: 0,
  },
  {
    id: '2',
    title: 'Test Preprint Submission 2',
    reviewsState: 'accepted',
    public: true,
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
        comment: 'Approved submission',
      },
    ],
    contributors: [],
    totalContributors: 0,
  },
  {
    id: '3',
    title: 'Test Preprint Submission 3',
    reviewsState: 'rejected',
    public: false,
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
        comment: 'Rejected submission',
      },
    ],
    contributors: [],
    totalContributors: 0,
  },
];
