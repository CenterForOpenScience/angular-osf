import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import { CollectionSubmission } from '@osf/shared/models/collections/collections.models';

export const MOCK_PROJECT_COLLECTION_SUBMISSIONS: CollectionSubmission[] = [
  {
    id: '1',
    type: 'collection-submissions',
    collectionTitle: 'Collection A',
    collectionId: 'col1',
    reviewsState: CollectionSubmissionReviewState.Accepted,
    collectedType: 'typeA',
    status: 'accepted',
    volume: 'vol1',
    issue: 'iss1',
    programArea: 'prog1',
    schoolType: 'school1',
    studyDesign: 'design1',
    dataType: 'data1',
    disease: 'disease1',
    gradeLevels: 'grade1',
  },
  {
    id: '2',
    type: 'collection-submissions',
    collectionTitle: 'Collection B',
    collectionId: 'col2',
    reviewsState: CollectionSubmissionReviewState.Pending,
    collectedType: 'typeB',
    status: 'pending',
    volume: 'vol2',
    issue: 'iss2',
    programArea: 'prog2',
    schoolType: 'school2',
    studyDesign: 'design2',
    dataType: 'data2',
    disease: 'disease2',
    gradeLevels: 'grade2',
  },
];
