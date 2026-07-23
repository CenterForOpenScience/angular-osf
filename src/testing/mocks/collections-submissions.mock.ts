import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import {
  CollectionSubmission,
  CollectionSubmissionWithGuid,
} from '@osf/shared/models/collections/collection-submissions.model';

export const MOCK_COLLECTION_SUBMISSION_1: CollectionSubmissionWithGuid = {
  id: '1',
  type: 'collection-submission',
  nodeId: 'node-123',
  nodeUrl: 'https://osf.io/node-123/',
  title: 'Test Collection Submission 1',
  description: 'This is a test collection submission 1',
  category: 'project',
  dateCreated: '2024-01-01T00:00:00Z',
  dateModified: '2024-01-02T00:00:00Z',
  public: false,
  reviewsState: CollectionSubmissionReviewState.Pending,
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

export const MOCK_COLLECTION_SUBMISSION_2: CollectionSubmissionWithGuid = {
  id: '2',
  type: 'collection-submission',
  nodeId: 'node-456',
  nodeUrl: 'https://osf.io/node-456/',
  title: 'Test Collection Submission 2',
  description: 'This is a test collection submission 2',
  category: 'project',
  dateCreated: '2024-01-02T00:00:00Z',
  dateModified: '2024-01-03T00:00:00Z',
  public: true,
  reviewsState: CollectionSubmissionReviewState.Accepted,
  creator: {
    id: 'user-456',
    fullName: 'Jane Smith',
  },
  actions: [
    {
      id: 'action-2',
      type: 'review',
      dateCreated: '2024-01-02T00:00:00Z',
      dateModified: '2024-01-02T00:00:00Z',
      fromState: 'pending',
      toState: 'approved',
      comment: 'Approved submission',
      trigger: 'manual',
      targetId: '2',
      targetNodeId: 'node-456',
      createdBy: 'moderator-456',
    },
  ],
};

export const MOCK_COLLECTION_SUBMISSIONS = [MOCK_COLLECTION_SUBMISSION_1, MOCK_COLLECTION_SUBMISSION_2];

export const MOCK_COLLECTION_SUBMISSION_BASE: CollectionSubmission = {
  id: 'sub-1',
  type: 'collection-submissions',
  collectionTitle: 'Collection',
  collectionId: 'col-1',
  reviewsState: CollectionSubmissionReviewState.Pending,
};

export const MOCK_COLLECTION_SUBMISSION_ACCEPTED: CollectionSubmission = {
  ...MOCK_COLLECTION_SUBMISSION_BASE,
  reviewsState: CollectionSubmissionReviewState.Accepted,
};
