import { PreprintReviewActionModel } from '@osf/features/moderation/models';

export const MOCK_PREPRINT_REVIEW_ACTIONS: PreprintReviewActionModel[] = [
  {
    id: '1',
    fromState: 'pending',
    toState: 'pending',
    dateModified: '2023-01-01',
    creator: {
      id: 'user-1',
      name: 'John Doe',
    },
    preprint: {
      id: 'preprint-1',
      name: 'Test Preprint',
    },
    provider: {
      id: 'provider-1',
      name: 'Test Provider',
    },
  },
  {
    id: '2',
    fromState: 'pending',
    toState: 'accepted',
    dateModified: '2023-01-02',
    creator: {
      id: 'user-2',
      name: 'Jane Doe',
    },
    preprint: {
      id: 'preprint-2',
      name: 'Test Preprint 2',
    },
    provider: {
      id: 'provider-2',
      name: 'Test Provider 2',
    },
  },
  {
    id: '3',
    fromState: 'pending',
    toState: 'rejected',
    dateModified: '2023-01-03',
    creator: {
      id: 'user-3',
      name: 'Bob Smith',
    },
    preprint: {
      id: 'preprint-3',
      name: 'Test Preprint 3',
    },
    provider: {
      id: 'provider-3',
      name: 'Test Provider 3',
    },
  },
];
