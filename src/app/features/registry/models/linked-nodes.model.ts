import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { ContributorModel } from '@shared/models/contributors/contributor.model';

export interface LinkedNode {
  id: string;
  title: string;
  description: string;
  category: string;
  dateCreated: string;
  dateModified: string;
  tags: string[];
  isPublic: boolean;
  contributors: ContributorModel[];
  htmlUrl: string;
  apiUrl: string;
}

export interface LinkedRegistration {
  id: string;
  title: string;
  description: string;
  category: string;
  dateCreated: string;
  dateModified: string;
  dateRegistered?: string;
  tags: string[];
  isPublic: boolean;
  reviewsState: RegistrationReviewStates;
  revisionState?: string;
  contributors: ContributorModel[];
  currentUserPermissions: string[];
  hasData?: boolean;
  hasAnalyticCode?: boolean;
  hasMaterials?: boolean;
  hasPapers?: boolean;
  hasSupplements?: boolean;
  withdrawn?: boolean;
  embargoed?: boolean;
  pendingWithdrawal?: boolean;
  pendingRegistrationApproval?: boolean;
  registrationSupplement?: string;
  subjects?: {
    id: string;
    text: string;
  }[][];
  provider?: string;
  registrationSchema?: string;
  registeredBy?: string;
  registeredFrom?: string;
}
