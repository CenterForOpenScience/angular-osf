import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';

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
