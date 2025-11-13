import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';

export interface SchemaResponse {
  id: string;
  dateCreated: string;
  dateSubmitted: string | null;
  dateModified: string;
  revisionJustification: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revisionResponses: Record<string, any>;
  updatedResponseKeys: string[];
  reviewsState: RevisionReviewStates;
  isPendingCurrentUserApproval: boolean;
  isOriginalResponse: boolean;
  registrationSchemaId: string;
  registrationId: string;
  filesLink?: string;
}
