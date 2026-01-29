import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';

export const createMockSchemaResponse = (
  id: string,
  reviewsState: RevisionReviewStates,
  isOriginalResponse = false
): SchemaResponse => ({
  id,
  dateCreated: '2023-01-01T00:00:00Z',
  dateSubmitted: '2023-01-02T00:00:00Z',
  dateModified: '2023-01-03T00:00:00Z',
  revisionJustification: 'Test justification',
  revisionResponses: {},
  updatedResponseKeys: [],
  reviewsState,
  isPendingCurrentUserApproval: false,
  isOriginalResponse,
  registrationSchemaId: 'schema-id',
  registrationId: 'registration-id',
});
