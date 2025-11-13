import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RegistryStatus } from '@osf/shared/enums/registry-status.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';

import { ContributorModel } from '../contributors/contributor.model';

export interface RegistrationCard {
  id: string;
  title: string;
  description: string;
  status: RegistryStatus;
  dateCreated: string;
  dateModified: string;
  contributors: ContributorModel[];
  registrationTemplate: string;
  registry: string;
  resources?: Record<string, string>;
  public: boolean | undefined;
  reviewsState?: RegistrationReviewStates;
  revisionState?: RevisionReviewStates;
  hasData?: boolean;
  hasAnalyticCode?: boolean;
  hasMaterials?: boolean;
  hasPapers?: boolean;
  hasSupplements?: boolean;
  rootParentId?: string | null;
  currentUserPermissions: UserPermissions[];
}
