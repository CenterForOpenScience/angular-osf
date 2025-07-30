import { RegistrationReviewStates } from '@shared/enums';

import { NodeBibliographicContributor } from './bibliographic-contributors.models';

export interface LinkedNode {
  id: string;
  title: string;
  description: string;
  category: string;
  dateCreated: string;
  dateModified: string;
  tags: string[];
  isPublic: boolean;
  contributorsCount?: number;
  contributors?: NodeBibliographicContributor[];
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
  contributorsCount?: number;
  reviewsState: RegistrationReviewStates;
  revisionState?: string;
  contributors?: NodeBibliographicContributor[];
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
