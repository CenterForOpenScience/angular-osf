import { PreprintSubmission, PreprintWithdrawalSubmission } from '@osf/features/moderation/models';
import { CollectionSubmissionWithGuid } from '@shared/models';

export const MOCK_PREPRINT_SUBMISSION: PreprintSubmission = {
  id: '1',
  title: 'Test Preprint Submission',
  reviewsState: 'pending',
  public: false,
  actions: [
    {
      id: '1',
      action: 'review',
      status: 'pending',
      date: '2023-01-01',
      user: 'John Doe',
    },
  ],
};

export const MOCK_PREPRINT_WITHDRAWAL_SUBMISSION: PreprintWithdrawalSubmission = {
  id: '1',
  preprintId: 'preprint-1',
  title: 'Test Withdrawal Submission',
  reviewsState: 'pending',
  public: false,
  actions: [
    {
      id: '1',
      action: 'withdrawal_review',
      status: 'pending',
      date: '2023-01-01',
      user: 'John Doe',
    },
  ],
};

export const MOCK_COLLECTION_SUBMISSION_WITH_GUID: CollectionSubmissionWithGuid = {
  id: '1',
  type: 'collection-submission',
  nodeId: 'node-123',
  nodeUrl: 'https://osf.io/node-123/',
  title: 'Test Collection Submission',
  description: 'This is a test collection submission',
  category: 'project',
  dateCreated: '2024-01-01T00:00:00Z',
  dateModified: '2024-01-02T00:00:00Z',
  public: false,
  reviewsState: 'pending',
  collectedType: 'preprint',
  status: 'pending',
  volume: '1',
  issue: '1',
  programArea: 'Science',
  schoolType: 'University',
  studyDesign: 'Experimental',
  dataType: 'Quantitative',
  disease: 'None',
  gradeLevels: 'Graduate',
  creator: {
    id: 'user-123',
    fullName: 'John Doe',
  },
  actions: [
    {
      id: 'action-1',
      type: 'review',
      dateCreated: '2024-01-01T00:00:00Z',
      dateModified: '2024-01-01T00:00:00Z',
      fromState: 'pending',
      toState: 'pending',
      comment: 'Initial review',
      trigger: 'manual',
      targetId: '1',
      targetNodeId: 'node-123',
      createdBy: 'moderator-123',
    },
  ],
};
