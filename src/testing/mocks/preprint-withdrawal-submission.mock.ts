import { PreprintWithdrawalSubmission } from '@osf/features/moderation/models';

export const MOCK_PREPRINT_WITHDRAWAL_SUBMISSIONS: PreprintWithdrawalSubmission[] = [
  {
    id: '1',
    title: 'Test Withdrawal 1',
    preprintId: 'preprint-1',
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
        comment: 'Withdrawal request',
      },
    ],
  },
  {
    id: '2',
    preprintId: 'preprint-2',
    title: 'Test Withdrawal 2',
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
        comment: 'Withdrawal approved',
      },
    ],
  },
  {
    id: '3',
    preprintId: 'preprint-3',
    title: 'Test Withdrawal 3',
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
        comment: 'Withdrawal rejected',
      },
    ],
  },
];
