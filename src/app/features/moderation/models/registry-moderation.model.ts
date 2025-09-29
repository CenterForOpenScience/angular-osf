import { RegistrationReviewStates, RevisionReviewStates } from '@osf/shared/enums';

import { ReviewAction } from './review-action.model';

export interface RegistryModeration {
  id: string;
  title: string;
  revisionStatus: RevisionReviewStates;
  reviewsState: RegistrationReviewStates;
  public: boolean;
  embargoed: boolean;
  embargoEndDate: string | null;
  actions: ReviewAction[];
  revisionId?: string | null;
}
