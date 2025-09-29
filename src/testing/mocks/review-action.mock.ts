import { ReviewAction } from '@osf/features/moderation/models';

export const REVIEW_ACTION_MOCK: ReviewAction = {
  id: 'action-1',
  trigger: 'accept',
  fromState: 'pending',
  toState: 'accepted',
  dateModified: '2024-01-01T10:00:00Z',
  creator: {
    id: 'user-1',
    name: 'Test User',
  },
  comment: 'Initial comment',
};
