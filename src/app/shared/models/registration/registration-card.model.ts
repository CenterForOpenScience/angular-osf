import { RegistrationReviewStates, RegistryStatus, RevisionReviewStates } from '@osf/shared/enums';

import { ContributorModel } from '../contributors';

export interface RegistrationCard {
  id: string;
  title: string;
  description: string;
  status: RegistryStatus;
  dateCreated: string;
  dateModified: string;
  contributors: Partial<ContributorModel>[];
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
}
