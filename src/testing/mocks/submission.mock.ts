import { PreprintSubmissionModel } from '@osf/features/moderation/models';
import { CollectionSubmissionWithGuid } from '@osf/shared/models/collections/collections.models';

import { MOCK_CONTRIBUTOR } from './contributors.mock';

export const MOCK_PREPRINT_SUBMISSION: PreprintSubmissionModel = {
  id: '1',
  title: 'Test Preprint Submission',
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
  contributors: [MOCK_CONTRIBUTOR],
  totalContributors: 1,
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
